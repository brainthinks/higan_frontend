'use strict';

const assert = require('assert').strict;
const uuidv4 = require('uuid/v4');
const path = require('path');

const Game = require('./Game');
const utils = require('./utils');

module.exports = class Games {
  static factory (games = []) {
    return new Games(games);
  }

  static async fromAbsolutePaths (gameConsole, paths = []) {
    const games = [];

    for (let i = 0; i < paths.length; i++) {
      const absolutePath = paths[i];

      const parentDirectory = path.dirname(absolutePath);
      const extension = path.extname(absolutePath);
      const basename = path.basename(absolutePath);
      const name = path.basename(absolutePath, extension);

      const game = Game.factory({
        id: uuidv4(),
        console: gameConsole,
        extension,
        name,
        parentDirectory,
        fileName: basename,
        pathToFile: absolutePath,
        urlToArtwork: '/artwork/nes.png',
      });

      await game.initialize();

      games.push(game);
    }

    return Games.factory(games);
  }

  static async fromDirectory (gameConsole, directory, extensions) {
    let files = [];

    for (let j = 0; j < extensions.length; j++) {
      const extension = extensions[j];

      files = files.concat(await utils.getFilesByExtension(directory, extension));
    }

    return Games.fromAbsolutePaths(gameConsole, files);
  }

  constructor (games = []) {
    assert.ok(Array.isArray(games), new Error('Cannot construct Games from anything other than array.'));

    this.games = {};
    this.ids = [];

    for (let i = 0; i < games.length; i++) {
      const game = games[i];

      this.add(game);
    }
  }

  get length () {
    return this.ids.length;
  }

  add (game) {
    assert.ok(Game.isGame(game), new Error('Cannot add anything but a Game instance.'));

    const id = game.id;

    this.ids.push(id)
    this.games[id] = game;

    return this;
  }

  removeById () {
    // @todo
  }

  forEach (fn) {
    for (let i = 0; i < this.length; i++) {
      const id = this.ids[i];
      const game = this.games[id];

      const result = fn(game, id, i);

      if (result === false) {
        return this;
      }
    }

    return this;
  }

  toObjects () {
    return Object.values(this.games).map((game) => game.toObject());
  }

  destroy () {
    // @todo
  }
}
