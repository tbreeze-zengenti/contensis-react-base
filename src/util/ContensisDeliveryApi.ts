import { VersionStatus } from 'contensis-core-api';
import { Client, Query } from 'contensis-delivery-api';
import { Config } from 'contensis-delivery-api/lib/models';
import { parse } from 'query-string';
import { setSurrogateKeys } from '~/routing/redux/actions';
import { reduxStore } from '~/redux/store/store';

import { CookieObject, findLoginCookies } from '~/user/util/CookieConstants';
import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';
import { SSRContext as SSRContextType } from '~/models';

export type SSRContext = Omit<SSRContextType, 'api'>;

const mapCookieHeader = (cookies: CookieObject | string) =>
  typeof cookies === 'object'
    ? Object.entries(cookies)
        .map(([name, value]) => `${name}=${value}`)
        .join('; ')
    : cookies;

const getSsrReferer = ({ request }: SSRContext) => {
  if (request) {
    try {
      const url = new URL(
        request.url,
        `${request.protocol || `http`}://${request.headers.host}`
      );
      return url.href;
    } catch (ex) {
      console.error(
        `getSsrReferer cannot parse url ${request.url} and host ${request.headers.host}`
      );

      return request.url;
    }
  }

  // if (typeof window === 'undefined') {
  //   const state = reduxStore.getState();
  //   const referer = `${selectCurrentHostname(state)}${selectCurrentPath(
  //     state
  //   )}${selectCurrentSearch(state)}`;

  //   return referer;
  // }
  return '';
};

/**
 * Store the surrogate-key header contents in redux state to output in SSR response
 */
const storeSurrogateKeys = (ssr?: SSRContext) => (response: any) => {
  let keys = '';
  if (response.status === 200) {
    keys = response.headers.get
      ? response.headers.get('surrogate-key')
      : response.headers.map['surrogate-key'];
    if (!keys) console.info(`[storeSurrogateKeys] No keys in ${response.url}`);
  }
  // Using imported reduxStore in SSR is unreliable during high
  // concurrent loads and exists here as a best effort fallback
  // in case the SSRContext is not provided
  const put = ssr?.dispatch || reduxStore?.dispatch;
  put?.(setSurrogateKeys(keys, response.url, response.status));
};

/**
 * Create a new Config object to create a DeliveryAPI Client
 */
const deliveryApiConfig = (ssr?: SSRContext) => {
  const config: Config = {
    ...DELIVERY_API_CONFIG /* global DELIVERY_API_CONFIG */,
  };

  // Add SSR headers and handlers
  if (typeof window === 'undefined') {
    config.defaultHeaders = {
      'x-require-surrogate-key': 'true', // request surrogate-key response header
      'x-crb-ssr': 'true', // add this for support tracing
    };
    if (ssr) config.defaultHeaders.referer = getSsrReferer(ssr); // add this for support tracing

    config.responseHandler = { [200]: storeSurrogateKeys(ssr) }; // for handling page cache invalidation
  }

  if (
    typeof window !== 'undefined' &&
    PROXY_DELIVERY_API /* global PROXY_DELIVERY_API */
  ) {
    // ensure a relative url is used to bypass the need for CORS (separate OPTIONS calls)
    config.rootUrl = '';
    config.responseHandler = { [404]: () => null };
  }
  return config;
};

export const getClientConfig = (project?: string, ssr?: SSRContext) => {
  const config = deliveryApiConfig(ssr);

  if (project) {
    config.projectId = project;
  }

  if (ssr?.cookies) {
    const cookieHeader = mapCookieHeader(findLoginCookies(ssr.cookies));
    if (cookieHeader) {
      config.defaultHeaders = Object.assign(config.defaultHeaders || {}, {
        Cookie: cookieHeader,
      });
    }
  }

  return config;
};

// export * from 'contensis-delivery-api';

declare let window: Window &
  typeof globalThis & {
    versionStatus?: VersionStatus;
  };

export class DeliveryApi {
  cookies?: CookieObject;
  ssr?: SSRContext;

  constructor(ssr?: SSRContext) {
    this.ssr = ssr;
    this.cookies = ssr?.cookies.raw;
  }

  getClientSideVersionStatus = () => {
    if (typeof window !== 'undefined') {
      // Allow overriding versionStatus with the querystring
      const { versionStatus } = parse(window.location.search);
      if (versionStatus) return versionStatus;
      // Client-side we will have a global variable set if rendered by SSR in production
      if (typeof window.versionStatus !== 'undefined')
        return window.versionStatus;
      // For localhost development we can only work out versionStatus from the current hostname
      const currentHostname = window.location.hostname;
      return this.getVersionStatusFromHostname(currentHostname);
    }
    return null;
  };

  getServerSideVersionStatus = (request: Request) =>
    request.query.versionStatus ||
    deliveryApi.getVersionStatusFromHeaders(request.headers) ||
    deliveryApi.getVersionStatusFromHostname(request.hostname);

  getVersionStatusFromHeaders = (headers: IncomingHttpHeaders) => {
    const versionStatusHeader = headers['x-entry-versionstatus'];
    if (typeof versionStatusHeader !== 'undefined') return versionStatusHeader;
    return null;
  };

  getVersionStatusFromHostname = (currentHostname: string) => {
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

  search = (query: Query, linkDepth = 0, project?: string) => {
    const client = Client.create(getClientConfig(project, this.ssr));
    return client.entries.search(
      query,
      typeof linkDepth !== 'undefined' ? linkDepth : 1
    );
  };

  getClient = (versionStatus: VersionStatus = 'published', project?: string) =>
    Client.create({
      ...getClientConfig(project, this.ssr),
      versionStatus,
    });

  getEntry = (
    id: string,
    linkDepth = 0,
    versionStatus: VersionStatus = 'published',
    project?: string
  ) => {
    const client = Client.create({
      ...getClientConfig(project, this.ssr),
      versionStatus,
    });
    return client.entries.get({ id, linkDepth });
  };
}

export const deliveryApi = new DeliveryApi();

export const deliveryApiWithCookies = (ssr?: SSRContext) =>
  new DeliveryApi(ssr);

export * from './CachedDeliveryApi';
