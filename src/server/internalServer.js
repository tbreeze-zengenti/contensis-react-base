import 'isomorphic-fetch';
import express from 'express';
import Loadable from 'react-loadable';

import DisplayStartupConfiguration from './util/displayStartupConfiguration';
import ConfigureLocalDNS from './core/localDns';
import ConfigureReverseProxies, { apiProxy } from './core/reverseProxies';
// import ServerFeatures from './features/configure';
import ConfigureWebApp from './core/webApp';

const app = express();

const start = (ReactApp, config, ServerFeatures) => {
  app.disable('x-powered-by');

  // Output some information about the used build/startup configuration
  DisplayStartupConfiguration(config);

  // Configure DNS to make life easier
  ConfigureLocalDNS();

  // Set-up local proxy for images from cms, to save doing rewrites and extra code
  ServerFeatures(app);
  ConfigureReverseProxies(app, config.reverseProxyPaths);
  ConfigureWebApp(app, ReactApp, config);

  app.use('/static', express.static('dist/static', { maxage: '31557600h' }));

  app.on('ready', () => {
    Loadable.preloadAll().then(() => {
      var server = app.listen(3001, () => {
        console.info(`HTTP server is listening @ port 3001`);
        setTimeout(function() {
          app.emit('app_started');
        }, 500);
      });
      app.on('stop', () => {
        server.close(function() {
          console.info('GoodBye :(');
        });
      });
    });
  });
};

export default { app, apiProxy, start };
