'use strict';

const express = require('express');
const cors = require('cors')

const Games = require('./Games');
const _routes = require('./routes');

const port = 3000;

module.exports = async (config) => {
  const games = await Games.fromDirectory(config.gameConsole, config.nesRomsDirectory, config.nesExtensions);

  const routes = _routes(games);
  const app = express();

  // @todo - for development use only!
  app.use(cors({ origin: true }));

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const middleware = route.middleware || [];

    app[route.method](route.path, ...middleware);
  }

  // Catch-all
  app.use('*', (req, res) => {
    console.log(`404 ${req.originalUrl}`);
    res.status(404).send('404');
  });

  // @todo - error handler

  await new Promise((resolve, reject) => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}!`);
      resolve();
    });
  })

  return app;
}

