import { produce } from 'immer';
import { jpath } from 'jsonpath-mapper';
import queryString from 'query-string';

const action = (type, payload = {}) => ({
  type,
  ...payload
});
const getJS = (state, stateKey) => {
  if ('get' in state && typeof state.get === 'function' && 'toJS' in state && typeof state.toJS === 'function') {
    return state.get(stateKey);
  }
  return state[stateKey];
};
const getImmutableOrJS = (state, stateKey, fallbackValue, returnType = globalThis.STATE_TYPE) => {
  var _globalThis$immutable, _globalThis$immutable2;
  // Find a fromJS function from global that is dynamically loaded in createStore
  // or replace with a stub function for non-immutable gets
  const fromJS = returnType === 'immutable' ? ((_globalThis$immutable = globalThis.immutable) === null || _globalThis$immutable === void 0 ? void 0 : _globalThis$immutable.fromJSOrdered) || ((_globalThis$immutable2 = globalThis.immutable) === null || _globalThis$immutable2 === void 0 ? void 0 : _globalThis$immutable2.fromJS) : v => v;
  if (state && 'get' in state && typeof state.get === 'function' && 'getIn' in state && typeof state.getIn === 'function' && 'toJS' in state && typeof state.toJS === 'function') {
    if (Array.isArray(stateKey)) return fromJS(state.getIn(stateKey, fallbackValue));
    return fromJS(state.get(stateKey, fallbackValue));
  }
  if (Array.isArray(stateKey) && state && typeof state === 'object') {
    const result = jpath(stateKey.join('.'), state);
    if (typeof result === 'undefined') return fallbackValue;
    return result;
  }
  const result = state && typeof state === 'object' ? state[stateKey] : undefined;
  if (typeof result === 'undefined') return fallbackValue;
  return result;
};

const ROUTING_PREFIX = '@ROUTING/';
const GET_ENTRY = `${ROUTING_PREFIX}_GET_ENTRY`;
const SET_ENTRY = `${ROUTING_PREFIX}_SET_ENTRY`;
const SET_NODE = `${ROUTING_PREFIX}_SET_NODE`;
const SET_ANCESTORS = `${ROUTING_PREFIX}_SET_ANCESTORS`;
const SET_SIBLINGS = `${ROUTING_PREFIX}_SET_SIBLINGS`;
const SET_ENTRY_ID = `${ROUTING_PREFIX}_SET_ENTRY_ID`;
const SET_SURROGATE_KEYS = `${ROUTING_PREFIX}_SET_SURROGATE_KEYS`;
const SET_NAVIGATION_PATH = `${ROUTING_PREFIX}_SET_NAVIGATION_PATH`;
const SET_TARGET_PROJECT = `${ROUTING_PREFIX}_SET_TARGET_PROJECT`;
const SET_ROUTE = `${ROUTING_PREFIX}_SET_ROUTE`;
const UPDATE_LOADING_STATE = `${ROUTING_PREFIX}_UPDATE_LOADING_STATE`;

var routing$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  GET_ENTRY: GET_ENTRY,
  SET_ENTRY: SET_ENTRY,
  SET_NODE: SET_NODE,
  SET_ANCESTORS: SET_ANCESTORS,
  SET_SIBLINGS: SET_SIBLINGS,
  SET_ENTRY_ID: SET_ENTRY_ID,
  SET_SURROGATE_KEYS: SET_SURROGATE_KEYS,
  SET_NAVIGATION_PATH: SET_NAVIGATION_PATH,
  SET_TARGET_PROJECT: SET_TARGET_PROJECT,
  SET_ROUTE: SET_ROUTE,
  UPDATE_LOADING_STATE: UPDATE_LOADING_STATE
});

const setNavigationPath = (path, location, staticRoute, withEvents, statePath, routes, ssr) => action(SET_NAVIGATION_PATH, {
  path,
  location,
  staticRoute,
  withEvents,
  statePath,
  routes,
  ssr
});
const setCurrentProject = (project, allowedGroups, hostname) => action(SET_TARGET_PROJECT, {
  project,
  allowedGroups,
  hostname
});
const setRoute = (path, state) => action(SET_ROUTE, {
  path,
  state
});
const setRouteEntry = entry => action(SET_ENTRY, {
  entry
});
const setSurrogateKeys = (keys, url, status) => action(SET_SURROGATE_KEYS, {
  keys,
  url,
  status
});

var routing$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  setNavigationPath: setNavigationPath,
  setCurrentProject: setCurrentProject,
  setRoute: setRoute,
  setRouteEntry: setRouteEntry,
  setSurrogateKeys: setSurrogateKeys
});

const ACTION_PREFIX = '@USER/';
const VALIDATE_USER = `${ACTION_PREFIX}VALIDATE_USER`;
const SET_AUTHENTICATION_STATE = `${ACTION_PREFIX}SET_AUTHENTICATION_STATE`;
const LOGIN_USER = `${ACTION_PREFIX}LOGIN_USER`;
const LOGIN_SUCCESSFUL = `${ACTION_PREFIX}LOGIN_SUCCESSFUL`;
const LOGIN_FAILED = `${ACTION_PREFIX}LOGIN_FAILED`;
const LOGOUT_USER = `${ACTION_PREFIX}LOGOUT_USER`;
const REGISTER_USER = `${ACTION_PREFIX}REGISTER_USER`;
const REGISTER_USER_SUCCESS = `${ACTION_PREFIX}REGISTER_USER_SUCCESS`;
const REGISTER_USER_FAILED = `${ACTION_PREFIX}REGISTER_USER_FAILED`;
const REQUEST_USER_PASSWORD_RESET = `${ACTION_PREFIX}REQUEST_USER_PASSWORD_RESET`;
const RESET_USER_PASSWORD = `${ACTION_PREFIX}RESET_USER_PASSWORD`;
const REQUEST_USER_PASSWORD_RESET_SENDING = `${ACTION_PREFIX}REQUEST_USER_PASSWORD_RESET_SENDING`;
const REQUEST_USER_PASSWORD_RESET_SUCCESS = `${ACTION_PREFIX}REQUEST_USER_PASSWORD_RESET_SUCCESS`;
const REQUEST_USER_PASSWORD_RESET_ERROR = `${ACTION_PREFIX}REQUEST_USER_PASSWORD_RESET_ERROR`;
const RESET_USER_PASSWORD_SENDING = `${ACTION_PREFIX}RESET_USER_PASSWORD_SENDING`;
const RESET_USER_PASSWORD_SUCCESS = `${ACTION_PREFIX}RESET_USER_PASSWORD_SUCCESS`;
const RESET_USER_PASSWORD_ERROR = `${ACTION_PREFIX}RESET_USER_PASSWORD_ERROR`;
const CHANGE_USER_PASSWORD = `${ACTION_PREFIX}CHANGE_USER_PASSWORD`;
const CHANGE_USER_PASSWORD_SENDING = `${ACTION_PREFIX}CHANGE_USER_PASSWORD_SENDING`;
const CHANGE_USER_PASSWORD_SUCCESS = `${ACTION_PREFIX}CHANGE_USER_PASSWORD_SUCCESS`;
const CHANGE_USER_PASSWORD_ERROR = `${ACTION_PREFIX}CHANGE_USER_PASSWORD_ERROR`;

var types = /*#__PURE__*/Object.freeze({
  __proto__: null,
  VALIDATE_USER: VALIDATE_USER,
  SET_AUTHENTICATION_STATE: SET_AUTHENTICATION_STATE,
  LOGIN_USER: LOGIN_USER,
  LOGIN_SUCCESSFUL: LOGIN_SUCCESSFUL,
  LOGIN_FAILED: LOGIN_FAILED,
  LOGOUT_USER: LOGOUT_USER,
  REGISTER_USER: REGISTER_USER,
  REGISTER_USER_SUCCESS: REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILED: REGISTER_USER_FAILED,
  REQUEST_USER_PASSWORD_RESET: REQUEST_USER_PASSWORD_RESET,
  RESET_USER_PASSWORD: RESET_USER_PASSWORD,
  REQUEST_USER_PASSWORD_RESET_SENDING: REQUEST_USER_PASSWORD_RESET_SENDING,
  REQUEST_USER_PASSWORD_RESET_SUCCESS: REQUEST_USER_PASSWORD_RESET_SUCCESS,
  REQUEST_USER_PASSWORD_RESET_ERROR: REQUEST_USER_PASSWORD_RESET_ERROR,
  RESET_USER_PASSWORD_SENDING: RESET_USER_PASSWORD_SENDING,
  RESET_USER_PASSWORD_SUCCESS: RESET_USER_PASSWORD_SUCCESS,
  RESET_USER_PASSWORD_ERROR: RESET_USER_PASSWORD_ERROR,
  CHANGE_USER_PASSWORD: CHANGE_USER_PASSWORD,
  CHANGE_USER_PASSWORD_SENDING: CHANGE_USER_PASSWORD_SENDING,
  CHANGE_USER_PASSWORD_SUCCESS: CHANGE_USER_PASSWORD_SUCCESS,
  CHANGE_USER_PASSWORD_ERROR: CHANGE_USER_PASSWORD_ERROR
});

const defaultAuthenticationState = {
  clientCredentials: null,
  errorMessage: null,
  isAuthenticated: false,
  isAuthenticationError: false,
  isError: false,
  isLoading: false
};
const defaultPasswordResetRequestValues = {
  isSending: false,
  sent: false,
  error: null
};
const defaultResetPasswordValues = {
  isSending: false,
  sent: false,
  error: null
};
const defaultChangePasswordValues = {
  isSending: false,
  sent: false,
  error: null
};
const defaultRegistrationValues = {
  isLoading: false,
  success: false,
  error: null
};
const initialUserState = {
  authenticationState: defaultAuthenticationState,
  passwordResetRequest: defaultPasswordResetRequestValues,
  resetPassword: defaultResetPasswordValues,
  changePassword: defaultChangePasswordValues,
  groups: []
};
var UserReducer = produce((state, action) => {
  switch (action.type) {
    case LOGOUT_USER:
      {
        return initialUserState;
      }
    case LOGIN_USER:
    case SET_AUTHENTICATION_STATE:
      {
        var _state, _state$authentication;
        if (!action.authenticationState) {
          action.authenticationState = defaultAuthenticationState;
        }
        const {
          authenticationState: {
            clientCredentials = null,
            errorMessage = null,
            isAuthenticated,
            isAuthenticationError = false,
            isError = false,
            isLoading = action.type === LOGIN_USER
          },
          user
        } = action;
        if (user) {
          user.name = `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}` || null;
          user.isZengentiStaff = user.email.includes('@zengenti.com');
        }
        state = {
          ...initialUserState,
          ...(user || state),
          authenticationState: {
            clientCredentials,
            errorMessage,
            isAuthenticated: isAuthenticated || ((_state = state) === null || _state === void 0 ? void 0 : (_state$authentication = _state.authenticationState) === null || _state$authentication === void 0 ? void 0 : _state$authentication.isAuthenticated),
            isAuthenticationError,
            isError,
            isLoading
          }
        };
        return state;
      }
    // REGISTER_USER is the trigger to set the user.registration initial state
    // and will set user.registration.isLoading to true
    // REGISTER_USER_FAILED will unset user.registration.isLoading and will set
    // the value in user.registration.error
    // REGISTER_USER_SUCCESS will unset user.registration.isLoading and will
    // set user.registration to the created user from the api response
    case REGISTER_USER:
    case REGISTER_USER_FAILED:
    case REGISTER_USER_SUCCESS:
      {
        const {
          error,
          user
        } = action;

        // Set registration object from the supplied action.user
        // so we can call these values back later
        state.registration = user || state.registration || defaultRegistrationValues;

        // Set registration flags so the UI can track the status
        state.registration.success = action.type === REGISTER_USER_SUCCESS;
        state.registration.error = error || false;
        state.registration.isLoading = action.type === REGISTER_USER;
        return;
      }
    case REQUEST_USER_PASSWORD_RESET_SENDING:
      if (state.passwordResetRequest) {
        state.passwordResetRequest = {
          ...defaultPasswordResetRequestValues
        };
        state.passwordResetRequest.isSending = true;
      }
      return;
    case REQUEST_USER_PASSWORD_RESET_SUCCESS:
      if (state.passwordResetRequest) {
        state.passwordResetRequest.isSending = false;
        state.passwordResetRequest.sent = true;
      }
      return;
    case REQUEST_USER_PASSWORD_RESET_ERROR:
      if (state.passwordResetRequest) {
        state.passwordResetRequest.isSending = false;
        state.passwordResetRequest.error = action.error;
      }
      return;
    case RESET_USER_PASSWORD_SENDING:
      if (state.resetPassword) {
        state.resetPassword.isSending = true;
      }
      return;
    case RESET_USER_PASSWORD_SUCCESS:
      if (state.resetPassword) {
        state.resetPassword.isSending = false;
        state.resetPassword.sent = true;
      }
      return;
    case RESET_USER_PASSWORD_ERROR:
      if (state.resetPassword) {
        state.resetPassword.isSending = false;
        state.resetPassword.error = action.error;
      }
      return;
    case CHANGE_USER_PASSWORD_SENDING:
      if (state.changePassword) {
        state.changePassword.isSending = true;
      }
      return;
    case CHANGE_USER_PASSWORD_SUCCESS:
      if (state.changePassword) {
        state.changePassword.isSending = false;
        state.changePassword.sent = true;
      }
      return;
    case CHANGE_USER_PASSWORD_ERROR:
      if (state.changePassword) {
        state.changePassword.isSending = false;
        state.changePassword.error = action.error;
      }
      return;
    default:
      return;
  }
}, initialUserState);

function queryParams(search) {
  return queryString.parse(typeof window != 'undefined' ? window.location.search : search);
}

const selectRouteEntry = (state, returnType) => getImmutableOrJS(state, ['routing', 'entry'], {}, returnType);
const selectMappedEntry = (state, returnType) => getImmutableOrJS(state, ['routing', 'mappedEntry'], null, returnType);
const selectSurrogateKeys = state => {
  const keys = getImmutableOrJS(state, ['routing', 'surrogateKeys'], [], 'js');
  return keys;
};
const selectSsrApiCalls = state => {
  return getImmutableOrJS(state, ['routing', 'apiCalls'], [], 'js');
};
const selectCurrentHostname = state => getImmutableOrJS(state, ['routing', 'currentHostname']);
const selectCurrentTreeID = state => getImmutableOrJS(state, ['routing', 'currentHostname']);
const selectRouteEntryEntryId = state => getImmutableOrJS(state, ['routing', 'entry', 'sys', 'id'], null);
const selectRouteEntryContentTypeId = state => {
  const entry = selectRouteEntry(state);
  return getImmutableOrJS(entry, ['sys', 'contentTypeId'], null);
};
const selectRouteEntryLanguage = state => {
  const entry = selectRouteEntry(state);
  return getImmutableOrJS(entry, ['sys', 'language'], null);
};
const selectRouteEntrySlug = state => {
  const entry = selectRouteEntry(state);
  return getImmutableOrJS(entry, ['sys', 'slug'], null);
};
const selectRouteEntryID = state => getImmutableOrJS(state, ['routing', 'entryID']);
const selectCanonicalPath = state => {
  return getImmutableOrJS(state, ['routing', 'canonicalPath']);
};
const selectCurrentPath = state => getImmutableOrJS(state, ['routing', 'currentPath']);
const selectCurrentLocation = state => getImmutableOrJS(state, ['routing', 'location']);
const selectCurrentSearch = state => getImmutableOrJS(state, ['routing', 'location', 'search']);
const selectCurrentHash = state => getImmutableOrJS(state, ['routing', 'location', 'hash']);
const selectQueryStringAsObject = state => queryParams(selectCurrentSearch(state));
const selectCurrentProject = state => getImmutableOrJS(state, ['routing', 'currentProject']);
const selectIsNotFound = state => getImmutableOrJS(state, ['routing', 'notFound']);
const selectCurrentAncestors = state => getImmutableOrJS(state, ['routing', 'currentNodeAncestors'], []);
const selectCurrentSiblings = state => getImmutableOrJS(state, ['routing', 'currentNodeSiblings'], []);
const selectCurrentNode = (state, returnType) => getImmutableOrJS(state, ['routing', 'currentNode'], null, returnType);
const selectCurrentChildren = state => getImmutableOrJS(state, ['routing', 'currentNode', 'children'], []);
const selectBreadcrumb = state => {
  return [...selectCurrentAncestors(state), selectCurrentNode(state)];
};
const selectRouteErrorMessage = state => {
  const error = getImmutableOrJS(state, ['routing', 'error']);
  return getImmutableOrJS(error, ['data', 'message'], getImmutableOrJS(error, 'statusText'));
};
const selectRouteIsError = state => getImmutableOrJS(state, ['routing', 'isError']);
const selectRouteLoading = state => getImmutableOrJS(state, ['routing', 'isLoading']);
const selectRouteStatusCode = state => getImmutableOrJS(state, ['routing', 'statusCode']);
const selectStaticRoute = state => getImmutableOrJS(state, ['routing', 'staticRoute']);

var routing = /*#__PURE__*/Object.freeze({
  __proto__: null,
  selectRouteEntry: selectRouteEntry,
  selectMappedEntry: selectMappedEntry,
  selectSurrogateKeys: selectSurrogateKeys,
  selectSsrApiCalls: selectSsrApiCalls,
  selectCurrentHostname: selectCurrentHostname,
  selectCurrentTreeID: selectCurrentTreeID,
  selectRouteEntryEntryId: selectRouteEntryEntryId,
  selectRouteEntryContentTypeId: selectRouteEntryContentTypeId,
  selectRouteEntryLanguage: selectRouteEntryLanguage,
  selectRouteEntrySlug: selectRouteEntrySlug,
  selectRouteEntryID: selectRouteEntryID,
  selectCanonicalPath: selectCanonicalPath,
  selectCurrentPath: selectCurrentPath,
  selectCurrentLocation: selectCurrentLocation,
  selectCurrentSearch: selectCurrentSearch,
  selectCurrentHash: selectCurrentHash,
  selectQueryStringAsObject: selectQueryStringAsObject,
  selectCurrentProject: selectCurrentProject,
  selectIsNotFound: selectIsNotFound,
  selectCurrentAncestors: selectCurrentAncestors,
  selectCurrentSiblings: selectCurrentSiblings,
  selectCurrentNode: selectCurrentNode,
  selectCurrentChildren: selectCurrentChildren,
  selectBreadcrumb: selectBreadcrumb,
  selectRouteErrorMessage: selectRouteErrorMessage,
  selectRouteIsError: selectRouteIsError,
  selectRouteLoading: selectRouteLoading,
  selectRouteStatusCode: selectRouteStatusCode,
  selectStaticRoute: selectStaticRoute
});

export { SET_AUTHENTICATION_STATE as $, RESET_USER_PASSWORD_SENDING as A, RESET_USER_PASSWORD_SUCCESS as B, CHANGE_USER_PASSWORD as C, RESET_USER_PASSWORD_ERROR as D, CHANGE_USER_PASSWORD_ERROR as E, CHANGE_USER_PASSWORD_SENDING as F, CHANGE_USER_PASSWORD_SUCCESS as G, selectRouteEntryContentTypeId as H, selectRouteIsError as I, selectIsNotFound as J, selectRouteLoading as K, selectCurrentPath as L, selectRouteStatusCode as M, selectRouteErrorMessage as N, setNavigationPath as O, setSurrogateKeys as P, selectCurrentHostname as Q, REGISTER_USER as R, SET_NAVIGATION_PATH as S, SET_TARGET_PROJECT as T, UPDATE_LOADING_STATE as U, SET_SURROGATE_KEYS as V, UserReducer as W, action as X, LOGIN_USER as Y, LOGOUT_USER as Z, VALIDATE_USER as _, selectSsrApiCalls as a, routing$2 as a0, routing$1 as a1, routing as a2, getJS as a3, types as a4, initialUserState as a5, selectRouteEntry as b, selectCurrentProject as c, setCurrentProject as d, selectCurrentSearch as e, SET_ROUTE as f, getImmutableOrJS as g, selectCurrentNode as h, selectCurrentAncestors as i, selectCurrentSiblings as j, selectRouteEntryEntryId as k, selectRouteEntryLanguage as l, selectMappedEntry as m, SET_ENTRY as n, SET_ANCESTORS as o, SET_SIBLINGS as p, REGISTER_USER_SUCCESS as q, REGISTER_USER_FAILED as r, selectSurrogateKeys as s, queryParams as t, setRoute as u, REQUEST_USER_PASSWORD_RESET as v, RESET_USER_PASSWORD as w, REQUEST_USER_PASSWORD_RESET_SENDING as x, REQUEST_USER_PASSWORD_RESET_SUCCESS as y, REQUEST_USER_PASSWORD_RESET_ERROR as z };
//# sourceMappingURL=selectors-d2bdfe22.js.map
