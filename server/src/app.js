'use strict';

const express = require('express');
const app = express();
const port = 3000;

const _routes = require('./routes');

module.exports = async (config) => {
  const routes = _routes(config);

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const middleware = route.middleware || [];

    app[route.method](route.path, ...middleware);
  }

  app.get('*', (req, res) => res.send('404'));

  await new Promise((resolve, reject) => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}!`);
      resolve();
    });
  })

  return app;
}

