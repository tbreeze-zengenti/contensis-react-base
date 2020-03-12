// load-entries.js
import * as log from 'loglevel';
import { takeEvery, put, select, call, all } from 'redux-saga/effects';
import {
  SET_ENTRY_ID,
  SET_ENTRY,
  SET_NAVIGATION_NOT_FOUND,
  SET_NODE,
  SET_ANCESTORS,
  SET_NAVIGATION_PATH,
  SET_ROUTE,
  CALL_HISTORY_METHOD,
  SET_SIBLINGS,
} from '~/core/redux/types/routing';
import { deliveryApi } from '~/core/util/ContensisDeliveryApi';
import { selectVersionStatus } from '~/core/redux/selectors/version';
import {
  selectCurrentPath,
  selectCurrentProject,
  selectRouteEntry,
} from '~/core/redux/selectors/routing';
import { GET_NODE_TREE } from '../types/navigation';
import { hasNavigationTree } from '../selectors/navigation';
import { routeEntryByFields } from './queries';

export const routingSagas = [
  takeEvery(SET_NAVIGATION_PATH, getRouteSaga),
  takeEvery(SET_ROUTE, setRouteSaga),
];

/**
 * To navigate / push a specific route via redux middleware
 * @param {path, state} action
 */
function* setRouteSaga(action) {
  yield put({
    type: CALL_HISTORY_METHOD,
    payload: {
      method: 'push',
      args: [action.path, action.state],
    },
  });
}

function* getRouteSaga(action) {
  let entry = null;
  try {
    const { withEvents, routes } = action;
    let appsays;
    if (withEvents && withEvents.onRouteLoad) {
      appsays = yield withEvents.onRouteLoad(action);
    }
    const state = yield select();
    const routeEntry = selectRouteEntry(state);
    if (
      (appsays && appsays.customRouting) ||
      (action.staticRoute && !action.staticRoute.route.fetchNode) ||
      (routeEntry && action.statePath === action.path)
    ) {
      // To prevent erroneous 404s and wasted network calls, this covers
      // - customRouting and SET_ENTRY via the consuming app
      // - all staticRoutes (where custom 'route.fetchNode' attribute is falsey)
      // - standard Contensis SiteView Routing where we already have the entry
      if (routeEntry) entry = routeEntry.toJS();
    } else {
      const currentPath = selectCurrentPath(state);
      const deliveryApiStatus = selectVersionStatus(state);
      const project = selectCurrentProject(state);

      let pathNode = null,
        ancestors = null,
        siblings = null;

      // Scroll into View
      if (typeof window !== 'undefined') {
        window.scroll({
          top: 0,
        });
      }

      let currentPathDepth = currentPath.split('/').length - 1;
      if (currentPath === '/') currentPathDepth = 0;

      // Handle homepage
      if (currentPath === '/') {
        pathNode = yield deliveryApi
          .getClient(deliveryApiStatus, project)
          .nodes.getRoot({
            depth: 0,
            entryFields: '*',
            entryLinkDepth: 4,
            language: 'en-GB',
          });
      } else {
        // Handle preview routes
        if (currentPath && currentPath.startsWith('/preview/')) {
          let splitPath = currentPath.split('/');
          let entryGuid = splitPath[2];
          if (splitPath.length == 3) {
            // According to product dev we cannot use Node API
            // for previewing entries as it gives a response of []
            // -- apparently it is not correct to request latest content
            // with Node API
            let previewEntry = yield deliveryApi
              .getClient(deliveryApiStatus, project)
              .entries.get({ id: entryGuid, linkDepth: 4 });
            if (previewEntry) {
              yield call(setRouteEntry, previewEntry);
            } else {
              yield call(do404);
            }
          }
        } else {
          // Handle all other routes
          pathNode = yield deliveryApi
            .getClient(deliveryApiStatus, project)
            .nodes.get({
              depth: 0,
              path: currentPath,
              entryFields: ['sys.contentTypeId', 'sys.id'],
              entryLinkDepth: 0,
            });
          if (
            pathNode &&
            pathNode.entry &&
            pathNode.entry.sys &&
            pathNode.entry.sys.id
          ) {
            const contentType =
              routes &&
              routes.ContentTypeMappings &&
              routes.ContentTypeMappings.find(
                ct => ct.contentTypeID === pathNode.entry.sys.contentTypeId
              );
            const query = routeEntryByFields(
              pathNode.entry.sys.id,
              contentType && contentType.fields,
              deliveryApiStatus
            );
            const payload = yield deliveryApi.search(
              query,
              (contentType && contentType.linkDepth) || 3,
              project
            );
            if (payload && payload.items && payload.items.length > 0) {
              pathNode.entry = payload.items[0];
            }
          }
        }

        if (pathNode && pathNode.id) {
          ancestors = yield deliveryApi
            .getClient(deliveryApiStatus, project)
            .nodes.getAncestors(pathNode.id);
          // No menu shows the  siblings at this level, so no need to load them.
          if (currentPathDepth > 1) {
            siblings = yield deliveryApi
              .getClient(deliveryApiStatus, project)
              .nodes.getSiblings({
                id: pathNode.id,
                entryFields: ['sys.contentTypeId', 'url'],
              });
          }
        }
      }

      if (
        pathNode &&
        pathNode.entry &&
        pathNode.entry.sys &&
        pathNode.entry.sys.id
      ) {
        entry = pathNode.entry;
        yield call(setRouteEntry, entry, pathNode, ancestors, siblings);
      } else {
        yield call(do404);
      }
    }
    if (withEvents && withEvents.onRouteLoaded) {
      appsays = yield withEvents.onRouteLoaded({ ...action, entry });
    }

    if (!hasNavigationTree(state) && (appsays && !appsays.customNavigation))
      // Load navigation clientside only, a put() should help that work
      yield put({ type: GET_NODE_TREE });
  } catch (e) {
    log.error(...['Error running route saga:', e, e.stack]);
    yield call(do404);
  }
}

function* setRouteEntry(entry, node, ancestors, siblings) {
  yield all([
    put({
      type: SET_NAVIGATION_NOT_FOUND,
      notFound: false,
    }),
    put({
      type: SET_NODE,
      node,
    }),
    put({
      type: SET_ENTRY,
      entry: entry,
    }),
    put({
      type: SET_ENTRY_ID,
      id: entry.sys.id,
    }),
    put({
      type: SET_ANCESTORS,
      ancestors,
    }),
    put({
      type: SET_SIBLINGS,
      siblings,
    }),
  ]);
}

function* do404() {
  yield put({
    type: SET_NAVIGATION_NOT_FOUND,
    notFound: true,
  });
  yield put({
    type: SET_ENTRY_ID,
    id: null,
  });
}
