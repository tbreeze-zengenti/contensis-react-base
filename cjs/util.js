'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var VersionInfo = require('./VersionInfo-df35c917.js');
var mapJson = require('jsonpath-mapper');
require('react');
require('react-redux');
require('./selectors-2c1b1183.js');
require('query-string');
require('./version-dcfdafd9.js');
require('styled-components');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var mapJson__default = /*#__PURE__*/_interopDefaultLegacy(mapJson);

const stringifyStrings = obj => {
  const returnObj = Array.isArray(obj) ? [] : {};
  Object.entries(obj).forEach(([key, value]) => {
    switch (typeof value) {
      case 'string':
        returnObj[key] = JSON.stringify(value);
        break;

      case 'object':
        returnObj[key] = stringifyStrings(value);
        break;

      default:
        returnObj[key] = value;
        break;
    }
  });
  return returnObj;
};

var stringifyStrings_1 = stringifyStrings;

const url = (alias, project) => {
  const projectAndAlias = project && project.toLowerCase() !== 'website' ? `${project.toLowerCase()}-${alias}` : alias;
  return {
    api: `https://api-${alias}.cloud.contensis.com`,
    cms: `https://cms-${alias}.cloud.contensis.com`,
    liveWeb: `https://live-${projectAndAlias}.cloud.contensis.com`,
    previewWeb: `https://preview-${projectAndAlias}.cloud.contensis.com`,
    iisWeb: `https://iis-live-${projectAndAlias}.cloud.contensis.com`,
    iisPreviewWeb: `https://iis-preview-${projectAndAlias}.cloud.contensis.com`
  };
};

/**
 *
 * @param {object} json The source object we wish to transform
 * @param {object} template The mapping template we wish to apply to the source
 * object to generate the intended target object
 */
const useMapper = (json, template) => {
  return template ? mapJson__default["default"](json || {}, template) : json;
};

const chooseMapperByFieldValue = (entry, mappers, field = 'sys.contentTypeId') => {
  const fieldValue = mapJson.jpath(field, entry || {});
  return mappers[fieldValue] || mappers.default || {};
};
/**
 * useEntriesMapper hook to take a list of entries from Delivery API along
 * with mappers for each contentTypeId and return an array of mapped objects
 * @param {any} entry The source entry we wish to transform
 * @param {object} mappers Object with keys containing mapper templates,
 * the key name matching sys.contentTypeId
 * @param {string} field Only include if we need to match content based on
 * a field other than sys.contentTypeId in the source data
 * @returns {object} Object transformed using a matched content type or
 * a default mapper template, returns an empty object if no mapper template
 * couild be applied.
 */


const useEntriesMapper = (entry, mappers, field = 'sys.contentTypeId') => {
  const mapper = chooseMapperByFieldValue(entry, mappers, field);
  return useMapper(entry, mapper);
};
/**
 * Deprecated: due to misleading name, use the hook useEntriesMapper instead
 */

const useEntryMapper = useEntriesMapper;
/**
 * mapEntries mapping function to take a list of entries from Delivery API along
 * with mappers for each contentTypeId and return an array of mapped objects
 * @param {any} entry The source entry we wish to transform
 * @param {object} mappers Object with keys containing mapper templates,
 * the key name matching sys.contentTypeId
 * @param {string} field Only include if we need to match content based on
 * a field other than sys.contentTypeId in the source data
 * @returns {object} Object transformed using a matched content type or
 * a default mapper template, returns an empty object if no mapper template
 * couild be applied.
 */

const mapEntries = (entries, mappers, field = 'sys.contentTypeId') => entries.map(entry => {
  const mapper = chooseMapperByFieldValue(entry, mappers, field);
  return mapper ? mapJson__default["default"](entry || {}, mapper) : entry;
});
/**
 * mapComposer mapping function to take a composer field from Delivery API along
 * with mappers for each Composer Item "type" and return an array of mapped components
 * @param {array} composer Composer field array of Composer Items
 * @param {object} mappers A keyed object with each key matching the Composer Item "type"
 * @returns {array} Array of mapped objects transformed using a matched Composer Item "type" mapping
 * or null. Injects a "_type" property into each transformed object in the array to indicate
 * where the mapping originated and for what component the mapped object is representing
 */

const mapComposer = (composer, mappers) => Array.isArray(composer) ? composer.map((composerItem, index) => {
  const itemValue = composerItem.value;
  const mapper = mappers[composerItem.type] || mappers.default;

  if (mapper) {
    // Add some fields into the composer item mapper and return object
    const addedFields = {
      _type: composerItem.type,
      _index: index
    }; // Add fields and $root item into the composer item source object
    // for use inside each item mapping, for arrays we inject the added fields
    // into the first array item. This is useful if we require any of
    // composerItem.type, composerItem index/position and composer $root
    // in scope to influence any composer item's mapping logic

    const sourceObject = itemValue && Array.isArray(itemValue) ? itemValue.map((iv, idx) => idx !== 0 ? iv : typeof iv === 'object' ? { ...addedFields,
      ...iv,
      $root: composer
    } : iv) : typeof itemValue === 'object' ? { ...addedFields,
      ...itemValue,
      $root: composer
    } : itemValue || {}; // Apply the composer item mapping

    const mappedFields = mapJson__default["default"](sourceObject, mapper); // Add the extra fields in with the return object

    return mappedFields && typeof mappedFields === 'object' ? { ...mappedFields,
      ...addedFields
    } : mappedFields;
  } else return {};
}) : composer || [];
/**
 * useComposerMapper hook to take a composer field from Delivery API along
 * with mappers for each Composer Item "type" and return an array of mapped components
 * @param {array} composer Composer field array of Composer Items
 * @param {object} mappers A keyed object with each key matching the Composer Item "type"
 * @returns {array} Array of mapped objects transformed using a matched Composer Item "type" mapping
 * or null. Injects a "_type" property into each transformed object in the array to indicate
 * where the mapping originated and for what component the mapped object is representing
 */

const useComposerMapper = (composer = [], mappers) => mapComposer(composer, mappers);
/**
 * entryMapper will return a function to satisfy an entryMapper when defining app route
 * this is essentially a shorthand function to prevent boilerplate repetition inside your routes file
 * you do not need to use this function should you wish to map your entry via raw JS functions
 * @param mapping the jsonpath-mapper mapping template to apply when the route is resolved
 * @returns {mappedEntry}
 */

const entryMapper = mapping => (node, state) => mapJson__default["default"]({ ...node,
  ...(node.entry || {}),
  state
}, mapping);

exports.VersionInfo = VersionInfo.VersionInfo;
exports.setCachingHeaders = VersionInfo.setCachingHeaders;
Object.defineProperty(exports, 'jpath', {
  enumerable: true,
  get: function () { return mapJson.jpath; }
});
Object.defineProperty(exports, 'mapJson', {
  enumerable: true,
  get: function () { return mapJson__default["default"]; }
});
exports.entryMapper = entryMapper;
exports.mapComposer = mapComposer;
exports.mapEntries = mapEntries;
exports.stringifyStrings = stringifyStrings_1;
exports.urls = url;
exports.useComposerMapper = useComposerMapper;
exports.useEntriesMapper = useEntriesMapper;
exports.useEntryMapper = useEntryMapper;
exports.useMapper = useMapper;
//# sourceMappingURL=util.js.map
