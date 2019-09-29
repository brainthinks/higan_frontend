'use strict';

const express = require('express');

const utils = require('./utils');

module.exports = (games) => {
  const routes = [
    {
      method: 'use',
      path: '/artwork',
      middleware: [
        express.static('artwork'),
      ],
    },
  ];

  games.forEach((game, id) => {
    console.log(id)
    routes.push({
      method: 'post',
      path: `/games/nes/${id}/play`,
      middleware: [
        async (req, res, next) => {
          utils.run('higan', [ '--fullscreen', game.pathToFile ]);
        },
      ],
    });
  });

  routes.push({
    method: 'get',
    path: '/games/nes',
    middleware: [
      async (req, res, next) => {
        res.send(games.toObjects());
      }
    ],
  });

  return routes;
};
