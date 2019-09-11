import { Client } from 'contensis-delivery-api';

const getClientConfig = () => {
  let config = DELIVERY_API_CONFIG; /* global DELIVERY_API_CONFIG */
  if (typeof window != 'undefined') {
    config.rootUrl = '';
    config.responseHandler = {
      404: () => null,
    };
    // ensure we go releative and by pass need for cors.
  }
  return config;
};
export * from 'contensis-delivery-api';

// This should only be executed on the client as it relies on the window.
export const GetClientSideDeliveryApiStatus = () => {
  if (typeof window != 'undefined') {
    const currentHostname = window.location.hostname;
    return GetDeliveryApiStatusFromHostname(currentHostname);
  }
  return null;
};

export const GetDeliveryApiStatusFromHostname = currentHostname => {
  if (currentHostname.indexOf('localhost') > -1) return 'latest';

  if (currentHostname.endsWith('contensis.cloud')) {
    if (currentHostname.indexOf('preview.') > -1) {
      return 'latest';
    } else {
      return 'published';
    }
  }

  if (currentHostname.endsWith('cloud.contensis.com')) {
    if (currentHostname.indexOf('preview-') > -1) {
      return 'latest';
    } else {
      return 'published';
    }
  }

  return 'published';
};

export const fixImageUri = object => {
  Object.keys(object).some(function(k) {
    if (k === 'asset') {
      //Should always have an ID, but lets check...
      if (object[k].sys && object[k].sys.id) {
        // We can exclude assets here i think... ?
        let userTransforms = object[k].transformations
          ? `&${object[k].transformations}`
          : '';
        let versionNo =
          object[k].sys.version && object[k].sys.version.versionNo;
        object[
          k
        ].sys.uri = `/image-library/${object[k].sys.uri}?invalidationKey=${versionNo}${userTransforms}`;
      }
      return false;
    }
    if (object[k] && typeof object[k] === 'object') {
      fixImageUri(object[k]);
      return false;
    }
  });
};

export const GetResponseGuids = object => {
  let Ids = [];
  Object.keys(object).some(function(k) {
    if (k === 'sys') {
      //Should always have an ID, but lets check...
      if (object[k].id) {
        // We can exclude assets here i think... ?
        if (object[k].dataFormat) {
          if (object[k].dataFormat !== 'asset') {
            if (object[k].language)
              Ids.push(`${object[k].id}_${object[k].language.toLowerCase()}`);
          }
        } else {
          // If we don't have a dataformat add it anyhow, for safety
          if (object[k].language)
            Ids.push(`${object[k].id}_${object[k].language.toLowerCase()}`);
        }
      }
      return false;
    }
    if (object[k] && typeof object[k] === 'object') {
      let subIds = GetResponseGuids(object[k]);
      if (subIds.length > 0) {
        Ids.push(...subIds);
      }
      return false;
    }
  });
  return Ids;
};

export const GetAllResponseGuids = object => {
  if (!object) return [];
  let returnItems = GetResponseGuids(object);
  let unique = [...new Set(returnItems)];
  return unique;
};
class DeliveryApi {
  search(query, linkDepth) {
    const client = Client.create(getClientConfig());
    return client.entries.search(query, linkDepth || 1);
  }

  getEntry(id, linkDepth = 1, deliveryApiStatus = 'published') {
    const baseConfig = getClientConfig();
    baseConfig.versionStatus = deliveryApiStatus;
    const client = Client.create(baseConfig);
    // return client.entries.get(id, linkDepth);
    return client.entries.get({ id, linkDepth });
  }

  getClient(deliveryApiStatus = 'published') {
    const baseConfig = getClientConfig();
    baseConfig.versionStatus = deliveryApiStatus;
    return Client.create(baseConfig);
  }
}

export const deliveryApi = new DeliveryApi();

class CacheNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class LruCache {
  constructor(limit = 100) {
    this.map = {};
    this.head = null;
    this.tail = null;
    this.limit = limit || 100;
    this.size = 0;
  }

  get(key) {
    if (this.map[key]) {
      let value = this.map[key].value;
      let node = new CacheNode(key, value);
      this.remove(key);
      this.setHead(node);
      return value;
    }
  }

  set(key, value) {
    let node = new CacheNode(key, value);
    if (this.map[key]) {
      this.remove(key);
    } else {
      if (this.size >= this.limit) {
        delete this.map[this.tail.key];
        this.size--;
        this.tail = this.tail.prev;
        this.tail.next = null;
      }
    }
    this.setHead(node);
  }

  setHead(node) {
    node.next = this.head;
    node.prev = null;
    if (this.head) {
      this.head.prev = node;
    }
    this.head = node;
    if (!this.tail) {
      this.tail = node;
    }
    this.size++;
    this.map[node.key] = node;
  }

  remove(key) {
    let node = this.map[key];
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }
    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
    delete this.map[key];
    this.size--;
  }
}

class CachedSearch {
  cache = new LruCache();
  taxonomyLookup = {};

  search(query, linkDepth) {
    const client = Client.create(getClientConfig());
    return this.request(JSON.stringify(query) + linkDepth.toString(), () =>
      client.entries.search(query, linkDepth)
    );
  }

  get(id, linkDepth, versionStatus) {
    const client = Client.create(getClientConfig());
    client.clientConfig.versionStatus = versionStatus;
    return this.request(id, () => client.entries.get({ id, linkDepth }));
  }

  getContentType(id) {
    const client = Client.create(getClientConfig());
    return this.request(`[CONTENT TYPE] ${id}`, () =>
      client.contentTypes.get(id)
    );
  }

  getTaxonomyNode(key) {
    const client = Client.create(getClientConfig());
    return this.request(`[TAXONOMY NODE] ${key}`, () =>
      client.taxonomy
        .resolveChildren(key)
        .then(node => this.extendTaxonomyNode(node))
    );
  }

  request(key, execute) {
    if (!this.cache.get(key) || typeof window == 'undefined') {
      let promise = execute();
      this.cache.set(key, promise);
      promise.catch(() => {
        this.cache.remove(key);
      });
    }
    return this.cache.get(key);
  }

  extendTaxonomyNode(node) {
    let id = this.getTaxonomyId(node);
    this.taxonomyLookup[id] = node.key;
    return {
      ...node,
      id,
      children: node.children
        ? node.children.map(n => this.extendTaxonomyNode(n))
        : null,
    };
  }

  getTaxonomyId(node) {
    if (node.key) {
      let parts = node.key.split('/');
      return parts[parts.length - 1];
    }
    return '';
  }

  getTaxonomyKey(id) {
    return this.taxonomyLookup[id];
  }
}

export const cachedSearch = new CachedSearch();
