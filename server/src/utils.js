'use strict';

const assert = require('assert').strict;
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const glob = require('glob');

function run (command, args = [], options = {}) {
  assert.ok(Array.isArray(args), new Error('args must be an array'));

  return new Promise((resolve, reject) => {
    console.log('About to run command: ', command, ...args);

    const childProcess = spawn(command, args);

    childProcess.stdout.on('data', options.onStdout || ((data) => {
      console.log(data);
    }));

    childProcess.stderr.on('data', options.onStderr || ((data) => {
      console.error('stderr: ', data);
    }));

    childProcess.on('close', (code) => {
      console.log('Finished running command: ', command, ...args);
      console.log(`"${command}" exited with code ${code}`);

      if (code !== 0) {
        return reject(`Process exited with code ${code}.  Review the output above.`);
      }

      resolve();
    });
  });
}

async function fileExists (pathToFile, throwIfNotExists = false) {
  if (!pathToFile) {
    if (throwIfNotExists) {
      throw new Error(`File ${pathToFile} does not exist.`);
    }

    return false;
  }

  const normalizedPathToFile = path.resolve(pathToFile);
  const exists = fs.existsSync(pathToFile);

  if (exists) {
    return normalizedPathToFile;
  }

  if (throwIfNotExists) {
    throw new Error(`File ${normalizedPathToFile} does not exist.`);
  }

  return false;
}

async function md5 (pathToFile) {
  let rawMd5Sum;

  pathToFile = await fileExists(pathToFile, true);

  await run('md5sum', [pathToFile], {
    onStdout: (data) => {
      rawMd5Sum = data.toString();
    },
  });

  if (!rawMd5Sum) {
    throw new Error(`Unable to calculate md5sum for ${pathToFile}`);
  }

  const md5Sum = rawMd5Sum.trim().split(' ')[0];

  return md5Sum;
}

function sleep (delay = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}

async function getFilesByExtension (directory, extension) {
  const files = await new Promise((resolve, reject) => {
    glob(path.resolve(directory, `*.${extension}`), async (error, files) => {
      if (error) {
        return reject(error)
      }

      resolve(files);
    });
  });

  return files;
}

module.exports = {
  run,
  fileExists,
  md5,
  sleep,
  getFilesByExtension,
};
