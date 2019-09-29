'use strict';

const express = require('express');

const Games = require('./Games');

module.exports = (config) => {
  const routes = [
    {
      method: 'use',
      path: '/artwork',
      middleware: [
        express.static('artwork'),
      ],
    },
    {
      method: 'get',
      path: '/games/nes',
      middleware: [
        async (req, res, next) => {
          const games = await Games.fromDirectory(config.gameConsole, config.nesRomsDirectory, config.nesExtensions);

          res.send(games.toObjects());
        }
      ],
    }
  ];

  return routes;
};
