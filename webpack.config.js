const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const webpack = require('webpack');
const compact = require('lodash/compact');
const path = require('path');

const pkg = require('./package.json');

const env = require('./env');
const { ifPreact, ifHot } = env;

const babelLoader = {
  loader: 'babel-loader',
  options: {
    presets: [
      [
        'env',
        {
          modules: false,
          debug: env.isDev,
          targets: {
            browsers: pkg.browserslist,
          },
          useBuiltIns: true,
        },
      ],
      'react',
      'stage-3',
    ],
  },
};

const svgoConfig = {
  plugins: [
    { removeXMLNS: true },
    { cleanupIDs: false },
    { convertShapeToPath: false },
    { removeEmptyContainers: false },
    { removeViewBox: false },
    { mergePaths: false },
    { convertStyleToAttrs: false },
    { convertPathData: false },
    { convertTransform: false },
    { removeUnknownsAndDefaults: false },
    { collapseGroups: false },
    { moveGroupAttrsToElems: false },
    { moveElemsAttrsToGroup: false },
    { cleanUpEnableBackground: false },
    { removeHiddenElems: false },
    { removeNonInheritableGroupAttrs: false },
    { removeUselessStrokeAndFill: false },
    { transformsWithOnePath: false },
  ],
};

const createSVGIc1onLoaders = name => [
  {
    loader: 'svg-sprite-loader',
    options: {
      extract: true,
      spriteFilename: name,
      runtimeCompat: false,
    },
  },
  {
    loader: 'svgo-loader',
    options: svgoConfig,
  },
];

module.exports = {
  entry: {
    bundle: [path.resolve(__dirname, 'index.ts')],
  },
  context: path.resolve(__dirname),
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'temp'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.module\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              namedExport: true,
              module: true,
              localIdentName: '[name]_[local]_[hash:base64:5]',
            },
          },
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [babelLoader],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          babelLoader,
          {
            loader: 'ts-loader',
            options: {
              module: 'es2015',
              jsx: 'preserve',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        include: [path.resolve(__dirname, 'src/icons')],
        use: createSVGIc1onLoaders('icons.svg'),
      },
    ],
  },
  resolve: {
    alias: Object.assign(
      {
        lodash: 'lodash-es',
      },
      ifPreact({
        react: 'preact-compat',
        'react-dom': 'preact-compat',
        'react-helmet': 'preact-helmet',
      }),
    ),
    extensions: ['.tsx', '.ts', '.js'],
    modules: [path.join(__dirname, 'src'), 'node_modules'],
  },
  plugins: compact([
    new SpriteLoaderPlugin(),
    new webpack.WatchIgnorePlugin([/\.d\.ts$/, /node_modules/]),
    new webpack.NoEmitOnErrorsPlugin(),
    ifHot(new webpack.HotModuleReplacementPlugin()),
  ]),
};
