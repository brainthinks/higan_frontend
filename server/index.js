'use strict';

const utils = require('./src/utils');
const App = require('./src/app');

async function main () {
  let nesRomsDirectory = process.argv[2];

  nesRomsDirectory = await utils.fileExists(nesRomsDirectory, true);

  const config = {
    gameConsole: 'Nintendo Entertainment System',
    nesRomsDirectory,
    nesExtensions: [ 'nes' ],
  };

  const app = await App(config);
}

main()
  .then(() => {
    //
  })
  .catch((error) => {
    console.error(error);
    console.error('Error while running higan frontend!');

    process.exit(1);
  });
