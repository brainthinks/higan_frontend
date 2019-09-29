'use strict';

const utils = require('./utils');

module.exports = class Game {
  static isGame (game) {
    // @todo
    return (game && game.id);
  }

  static factory (...args) {
    return new Game(...args);
  }

  static generateMd5 (pathToFile) {
    return utils.md5(pathToFile);
  }

  constructor ({
    console: _console,
    id,
    name,
    title,
    extension,
    parentDirectory,
    fileName,
    pathToFile,
    urlToArtwork,
  }) {
    this.console = _console;
    this.id = id;
    this.name = name;
    this.title = title;
    this.extension = extension;
    this.parentDirectory = parentDirectory;
    this.fileName = fileName;
    this.pathToFile = pathToFile;
    this.urlToArtwork = urlToArtwork;

    this.isInitialized = false;
    this.isDestroyed = false;
  }

  async initialize () {
    if (this.isInitialized) {
      console.warn('Trying to initialize an already initialized Game');
      return this;
    }

    this.md5 = await Game.generateMd5(this.pathToFile);

    this.isInitialized = true;

    return this;
  }

  toObject () {
    return {
      console: this.console,
      id: this.id,
      name: this.name,
      title: this.title,
      extension: this.extension,
      parentDirectory: this.parentDirectory,
      fileName: this.fileName,
      pathToFile: this.pathToFile,
      urlToArtwork: this.urlToArtwork,
      md5: this.md5,
    };
  }

  destroy () {
    if (this.isDestroyed) {
      console.warn('Trying to destroy an already destroyed Game');
      return;
    }

    this.isDestroyed = true;

    this.console = null;
    this.id = null;
    this.name = null;
    this.title = null;
    this.extension = null;
    this.parentDirectory = null;
    this.fileName = null;
    this.pathToFile = null;
    this.urlToArtwork = null;
    this.md5 = null;
    this.isInitialized = null;
  }
};
