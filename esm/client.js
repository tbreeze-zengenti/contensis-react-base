import 'isomorphic-fetch';
import { preloadReady } from 'react-loadable';
import React from 'react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import 'react-router-config';
import 'jsonpath-mapper';
import 'redux';
import 'redux-thunk';
import 'redux-saga';
import 'redux-injectors';
import 'immer';
import { c as createStore, s as setVersionStatus } from './version-92a0891c.js';
import { s as setCurrentProject } from './actions-b04dc865.js';
import './reducers-d6c0edb1.js';
import 'history';
import { d as deliveryApi, b as browserHistory, r as rootSaga, p as pickProject } from './App-1598c262.js';
export { A as ReactApp } from './App-1598c262.js';
import '@redux-saga/core/effects';
import 'contensis-delivery-api';
import './selectors-3950c020.js';
import './version-2c262b62.js';
import { parse } from 'query-string';
import 'loglevel';
import './ToJs-7ef6efb1.js';
import './login-f8169a12.js';
import 'await-to-js';
import 'js-cookie';
import { AppContainer } from 'react-hot-loader';
import './RouteLoader-32ac2f2a.js';
import { hydrate, render } from 'react-dom';

class ClientApp {
  constructor(ReactApp, config) {
    const documentRoot = document.getElementById('root');
    const {
      stateType = 'immutable',
      routes,
      withReducers,
      withSagas,
      withEvents
    } = config;

    const GetClientJSX = store => {
      const ClientJsx = /*#__PURE__*/React.createElement(AppContainer, null, /*#__PURE__*/React.createElement(Provider, {
        store: store
      }, /*#__PURE__*/React.createElement(Router, {
        history: browserHistory
      }, /*#__PURE__*/React.createElement(ReactApp, {
        routes: routes,
        withEvents: withEvents
      }))));
      return ClientJsx;
    };

    const isProduction = !(process.env.NODE_ENV !== 'production');
    /**
     * Webpack HMR Setup.
     */

    const HMRRenderer = Component => {
      preloadReady().then(() => {
        if (isProduction) hydrate(Component, documentRoot);else render(Component, documentRoot);
      });
    };

    const hmr = store => {
      // webpack Hot Module Replacement API
      if (module.hot) {
        module.hot.accept(ReactApp, () => {
          // if you are using harmony modules ({modules:false})
          HMRRenderer(GetClientJSX(store));
        });
      }
    };

    const qs = parse(window.location.search);
    const versionStatusFromHostname = deliveryApi.getClientSideVersionStatus();

    if (window.isDynamic || window.REDUX_DATA || process.env.NODE_ENV !== 'production') {
      createStore(withReducers, window.REDUX_DATA, browserHistory, stateType).then(store => {
        store.dispatch(setVersionStatus(qs.versionStatus || versionStatusFromHostname));
        /* eslint-disable no-console */

        console.log('Hydrating from inline Redux');
        /* eslint-enable no-console */

        store.runSaga(rootSaga(withSagas));
        store.dispatch(setCurrentProject(pickProject(window.location.hostname, qs), [], window.location.hostname));
        delete window.REDUX_DATA;
        HMRRenderer(GetClientJSX(store));
        hmr(store);
      });
    } else {
      fetch(`${window.location.pathname}?redux=true`).then(response => response.json()).then(data => {
        /* eslint-disable no-console */
        // console.log('Got Data Back');
        // console.log(data);

        /* eslint-enable no-console */
        const ssRedux = JSON.parse(data);
        createStore(withReducers, ssRedux, browserHistory, stateType).then(store => {
          // store.dispatch(setVersionStatus(versionStatusFromHostname));
          store.runSaga(rootSaga(withSagas));
          store.dispatch(setCurrentProject(pickProject(window.location.hostname, parse(window.location.search)), [], window.location.hostname)); // if (typeof window != 'undefined') {
          //   store.dispatch(checkUserLoggedIn());
          // }

          HMRRenderer(GetClientJSX(store));
          hmr(store);
        });
      });
    }
  }

}

export default ClientApp;
//# sourceMappingURL=client.js.map
