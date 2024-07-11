import { compose, applyMiddleware, createStore as createStore$1, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createSagaMiddleware, { END } from 'redux-saga';
import { createInjectorsEnhancer } from 'redux-injectors';
import { produce, original } from 'immer';
import { Q as SET_TARGET_PROJECT, T as SET_SURROGATE_KEYS, p as SET_SIBLINGS, f as SET_ROUTE, S as SET_NAVIGATION_PATH, U as UPDATE_LOADING_STATE, n as SET_ENTRY, o as SET_ANCESTORS, V as UserReducer } from './selectors-bb117d1b.js';

const ACTION_PREFIX = '@NAVIGATION/';
const GET_NODE_TREE = `${ACTION_PREFIX}_GET_NODE_TREE`;
const SET_NODE_TREE = `${ACTION_PREFIX}_SET_NODE_TREE`;
const GET_NODE_TREE_ERROR = `${ACTION_PREFIX}_GET_NODE_TREE_ERROR`;

var navigation = /*#__PURE__*/Object.freeze({
  __proto__: null,
  GET_NODE_TREE: GET_NODE_TREE,
  SET_NODE_TREE: SET_NODE_TREE,
  GET_NODE_TREE_ERROR: GET_NODE_TREE_ERROR
});

const initialState$2 = {
  root: null,
  error: {
    isError: false,
    message: null
  },
  isReady: false
};
var NavigationReducer = produce((state, action) => {
  switch (action.type) {
    case SET_NODE_TREE:
      {
        state.root = action.nodes;
        state.isReady = true;
        return;
      }
    case GET_NODE_TREE_ERROR:
      {
        state.error.isError = true;
        state.error.message = action.error || 'Unknown error occurred';
        return;
      }
    default:
      return;
  }
}, initialState$2);

const initialState$1 = {
  canonicalPath: null,
  currentHostname: null,
  currentPath: '/',
  currentNode: {},
  currentNodeAncestors: [],
  currentProject: 'unknown',
  entryID: null,
  entry: null,
  error: undefined,
  isError: false,
  isLoading: false,
  location: {},
  mappedEntry: null,
  notFound: false,
  staticRoute: null,
  statusCode: 200,
  surrogateKeys: [],
  apiCalls: []
};
var RoutingReducer = produce((state, action) => {
  switch (action.type) {
    case SET_ANCESTORS:
      {
        state.currentNodeAncestors = action.ancestors;
        return;
      }
    case SET_ENTRY:
      {
        const {
          entry,
          error,
          mappedEntry,
          node = {},
          isError = false,
          isLoading = false,
          notFound = false,
          statusCode,
          currentPath
        } = action;
        let defaultStatus = 200;
        if (notFound === true && isError === false) defaultStatus = 404;else if (isError === true) defaultStatus = statusCode || 500;
        if (!entry) {
          state.entryID = null;
          state.entry = null;
          state.error = error;
          state.mappedEntry = null;
          state.isError = isError;
          state.isLoading = isLoading;
          state.notFound = notFound;
          state.statusCode = statusCode || defaultStatus;
          state.canonicalPath = currentPath;
        } else {
          state.entryID = action.id;
          state.entry = entry;
          state.error = error;
          state.isError = isError;
          state.isLoading = isLoading;
          state.notFound = notFound;
          state.statusCode = statusCode || defaultStatus;
          state.canonicalPath = entry.sys.uri || currentPath;
          if (mappedEntry && Object.keys(mappedEntry).length > 0) {
            state.mappedEntry = mappedEntry;
            state.entry = {
              sys: entry.sys
            };
          }
        }
        if (!node) {
          state.currentNode = null;
        } else {
          // On Set Node, we reset all dependants.
          state.currentNode = node;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const {
            entry,
            ...nodeWithoutEntry
          } = node; // We have the entry stored elsewhere, so lets not keep it twice.
          state.currentNode = nodeWithoutEntry;
        }
        return;
      }
    case UPDATE_LOADING_STATE:
      {
        state.isLoading = action.isLoading;
        return;
      }
    case SET_NAVIGATION_PATH:
      {
        let staticRoute = {};
        if (action.staticRoute) {
          staticRoute = {
            ...action.staticRoute
          };
        }
        if (action.path) {
          var _state$entry, _state$entry$sys;
          // Don't run a path update on initial load as we allready should have it in redux
          const entryUri = state === null || state === void 0 ? void 0 : (_state$entry = state.entry) === null || _state$entry === void 0 ? void 0 : (_state$entry$sys = _state$entry.sys) === null || _state$entry$sys === void 0 ? void 0 : _state$entry$sys.uri;
          if (entryUri !== action.path) {
            state.currentPath = action.path;
            state.location = action.location;
            state.staticRoute = {
              ...staticRoute,
              route: {
                ...staticRoute.route,
                component: null
              }
            };
            state.isLoading = typeof window !== 'undefined';
          } else {
            state.location = action.location;
            state.staticRoute = {
              ...staticRoute,
              route: {
                ...staticRoute.route,
                component: null
              }
            };
          }
        }
        return;
      }
    case SET_ROUTE:
      {
        state.nextPath = action.path;
        return;
      }
    case SET_SIBLINGS:
      {
        // Can be null in some cases like the homepage.
        let currentNodeSiblingParent = null;
        if (action.siblings && action.siblings.length > 0) {
          currentNodeSiblingParent = action.siblings[0].parentId;
        }
        state.currentNodeSiblings = action.siblings;
        state.currentNodeSiblingsParent = currentNodeSiblingParent;
        return;
      }
    case SET_SURROGATE_KEYS:
      {
        const newKeys = (action.keys || '').split(' ');
        const allKeys = [...original(state.surrogateKeys), ...newKeys];
        const uniqueKeys = [...new Set(allKeys)];
        state.surrogateKeys = uniqueKeys;
        state.apiCalls = [...original(state.apiCalls), [action.status, newKeys.length, action.url]];
        return;
      }
    case SET_TARGET_PROJECT:
      {
        state.currentProject = action.project;
        state.allowedGroups = action.allowedGroups;
        state.currentHostname = action.hostname;
        return;
      }
    default:
      return state;
  }
}, initialState$1);

const VERSION_PREFIX = '@VERSION/';
const SET_VERSION = `${VERSION_PREFIX}SET_VERSION`;
const SET_VERSION_STATUS = `${VERSION_PREFIX}SET_VERSION_STATUS`;

var version = /*#__PURE__*/Object.freeze({
  __proto__: null,
  SET_VERSION: SET_VERSION,
  SET_VERSION_STATUS: SET_VERSION_STATUS
});

const initialState = {
  commitRef: null,
  buildNo: null,
  contensisVersionStatus: null
};
var VersionReducer = produce((state, action) => {
  switch (action.type) {
    case SET_VERSION_STATUS:
      {
        state.contensisVersionStatus = action.status;
        return;
      }
    case SET_VERSION:
      {
        state.commitRef = action.commitRef;
        state.buildNo = action.buildNo;
        return;
      }
    default:
      return;
  }
}, initialState);

/**
 * This middleware captures 'CALL_HISTORY_METHOD' actions to redirect to the
 * provided history object. This will prevent these actions from reaching your
 * reducer or any middleware that comes after this one.
 */
/* eslint-disable no-unused-vars */
const routerMiddleware = history => store => next => action => {
  if (action.type !== 'CALL_HISTORY_METHOD') {
    return next(action);
  }
  const {
    payload: {
      method,
      args
    }
  } = action;
  history[method](...args);
};

/* eslint-disable no-underscore-dangle */

let reduxStore;
var createStore = (async (featureReducers, initialState, history, stateType) => {
  let reduxDevToolsMiddleware = f => f;
  if (typeof window != 'undefined') {
    reduxDevToolsMiddleware = window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f;
  }
  const sagaMiddleware = createSagaMiddleware();
  const reducers = {
    navigation: NavigationReducer,
    routing: RoutingReducer,
    user: UserReducer,
    version: VersionReducer,
    ...featureReducers
  };

  // Reassign the combiner and fromJS functions when
  // stateType is 'immutable' with dynamic imports
  let combiner = combineReducers;
  let fromJS = obj => obj;
  globalThis.STATE_TYPE = stateType;
  if (stateType === 'immutable') {
    globalThis.immutable = await import( /* webpackChunkName: "immutable" */'immutable');
    fromJS = (await import( /* webpackChunkName: "from-js" */'./fromJSLeaveImmer-e2dacd63.js')).default;
    combiner = (await import( /* webpackChunkName: "redux-immutable" */'redux-immutable')).combineReducers;
  }
  const createReducer = (injectedReducers = {}) => {
    const rootReducer = combiner({
      ...injectedReducers,
      // other non-injected reducers go here
      ...reducers
    });
    return rootReducer;
  };
  const store = initialState => {
    const runSaga = sagaMiddleware.run;
    const middleware = compose(applyMiddleware(thunkMiddleware, sagaMiddleware, routerMiddleware(history)), createInjectorsEnhancer({
      createReducer,
      runSaga
    }), reduxDevToolsMiddleware);
    const store = createStore$1(createReducer(), initialState, middleware);
    store.runSaga = runSaga;
    store.close = () => store.dispatch(END);
    return store;
  };
  reduxStore = store(fromJS(initialState));
  return reduxStore;
});

export { GET_NODE_TREE as G, SET_NODE_TREE as S, GET_NODE_TREE_ERROR as a, SET_VERSION_STATUS as b, createStore as c, SET_VERSION as d, navigation as n, reduxStore as r, version as v };
//# sourceMappingURL=store-2ff73952.js.map
