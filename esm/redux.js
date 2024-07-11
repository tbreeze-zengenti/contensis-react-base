import { n as navigation$2, v as version$1, G as GET_NODE_TREE } from './store-2ff73952.js';
export { r as store } from './store-2ff73952.js';
import { $ as routing$1, W as action, a0 as routing$2, a1 as routing$3 } from './selectors-bb117d1b.js';
export { W as action, g as getIn, a2 as getJS } from './selectors-bb117d1b.js';
import { v as version$2, n as navigation$3 } from './version-49ad9e9d.js';
export { c as convertSagaArray, b as injectReducer, i as injectRedux, d as injectSaga, u as useInjectRedux } from './version-49ad9e9d.js';
import { v as version$3 } from './version-df7f7154.js';
import 'redux';
import 'redux-thunk';
import 'redux-saga';
import 'redux-injectors';
import 'immer';
import 'jsonpath-mapper';
import 'query-string';
import '@redux-saga/core/effects';

var types = {
  navigation: navigation$2,
  routing: routing$1,
  version: version$1
};

const loadNavigationTree = () => action(GET_NODE_TREE);

var navigation$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  loadNavigationTree: loadNavigationTree
});

var actions = {
  navigation: navigation$1,
  routing: routing$2,
  version: version$2
};

var selectors = {
  navigation: navigation$3,
  routing: routing$3,
  version: version$3
};

// Remap the objects so they are presented in "feature" hierarchy
// e.g. { routing: { types, actions }, navigation: { types, actions } }
// instead of { types: { routing, navigation }, actions: { routing, navigation } }

const navigation = {
  types: types.navigation,
  actions: actions.navigation,
  selectors: selectors.navigation
};
const routing = {
  types: types.routing,
  actions: actions.routing,
  selectors: selectors.routing
};
const version = {
  types: types.version,
  actions: actions.version,
  selectors: selectors.version
};

export { navigation, routing, version };
//# sourceMappingURL=redux.js.map
