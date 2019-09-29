'use strict';

const path = require('path');
const chalk = require('chalk');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

const packageJson = require('./package.json');

const DESTINATION_PATH = path.resolve(__dirname, 'dist');

function generateProgressBarPlugin (name) {
  const building = chalk.bold(`Building ${name} page...`);
  const bar = chalk.bgBlue.white.bold('[:bar]');
  const percent = chalk.bold.green(':percent');
  const elapsed = chalk.bold('(:elapsed seconds)');

  return new ProgressBarPlugin({
    format: `   ${building} ${bar} ${percent} ${elapsed}`,
    clear: false,
  });
}

function generateExtractSassPlugin () {
  // @see - https://github.com/webpack-contrib/sass-loader
  return new ExtractTextPlugin({
    filename: '[name].css',
  });
}

// @todo - I'm sure there is a better way to do this
function generateEjsPlugin (pathToTemplate) {
  return [
    // @see - https://github.com/jantimon/html-webpack-plugin#configuration
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
      template: pathToTemplate,
      inject: true,
      chunksSortMode: (a, b) => {
        if (a.names[0] === 'polyfills') {
          return -1;
        }
        else if (a.names[0] === 'globalErrorHandlers') {
          return -1;
        }

        if (b.names[0] === 'polyfills') {
          return 1;
        }
        else if (b.names[0] === 'globalErrorHandlers') {
          return 1;
        }

        return 0;
      },
    }),
    new HtmlWebpackHarddiskPlugin(),
  ];
}

function generateWriteFilePlugin () {
  return new WriteFilePlugin();
}

function generateJsRule (srcPath) {
  return {
    test: /\.(js|jsx)$/,
    loader: 'babel-loader?cacheDirectory=true',
    options: {
      presets: [
        [
          '@babel/preset-env',
          {
            exclude: [
              '@babel/plugin-transform-typeof-symbol',
            ],
          },
        ],
        [ '@babel/preset-react' ],
      ],
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-class-properties',
      ],
    },
    // @see - https://github.com/webpack/webpack/issues/2031
    include: [
      srcPath,
      // @see - https://github.com/visionmedia/debug/issues/668
      path.resolve(
        __dirname,
        'node_modules',
        'debug'
      ),
    ],
  };
}

function generateStyleRules (extractSass) {
  return [
    // @todo - postcss?
    // @see - https://github.com/bensmithett/webpack-css-example/blob/master/webpack.config.js
    {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      loader: 'url-loader',
    },
    {
      test: /\.s?css$/,
      use: extractSass.extract({
        fallback: 'style-loader',
        use: [
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      }),
    },
  ];
}

function generateConfig (entrypoint = 'index') {
  const name = packageJson.name;
  const srcPath = path.resolve(__dirname, 'src');

  const extractSass = generateExtractSassPlugin();

  return {
    name,
    entry: {
      // @see - https://github.com/webpack-contrib/webpack-serve/issues/27
      polyfills: [ path.resolve(srcPath, 'polyfills.js') ],
      globalErrorHandlers: [ path.resolve(srcPath, 'globalErrorHandlers.js') ],
      [name]: [ path.resolve(srcPath, `${entrypoint}.js`) ],
    },
    output: {
      path: DESTINATION_PATH,
      filename: '[name].js',
    },
    module: {
      rules: [
        generateJsRule(srcPath),
        ...generateStyleRules(extractSass),
      ],
    },
    resolve: {
      extensions: [ '.js', '.jsx' ],
      alias: {
        '~root': __dirname,
      },
    },
    plugins: [
      generateProgressBarPlugin(name),
      ...generateEjsPlugin(path.resolve(srcPath, `${entrypoint}.ejs`)),
      extractSass,
      generateWriteFilePlugin(),
    ],
  };
}

module.exports = function () {
  return [
    generateConfig(),
  ];
};
