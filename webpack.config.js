const webpack = require('webpack');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const NameAllModulesPlugin = require('name-all-modules-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const WebpackHTMLPlugin = require('html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');

const autoprefixer = require('autoprefixer');
const normalize = require('postcss-normalize');
const stylelint = require('stylelint');

const { compact } = require('lodash');
const path = require('path');
const fs = require('fs');
const debug = require('debug');
const pkg = require('./package.json');
const env = require('./env');

const { ifES5, ifESNext, ifLint, ifProd, ifReact, ifPreact, ifHot, ifTest } = env;

const log = debug('build');

if (env.isPreact) {
  log('Building with Preact instead of React');
}

if (env.isES5) {
  log('Building with babel-preset-es2015 instead of babel-preset-env');
}

if (!env.shouldLint) {
  log('Linting is disabled');
}

const excludedPatterns = compact([
  /node_modules/,
  ifProd(/\.test\.tsx?$/),
  ifProd(/\.test\.jsx?$/),
]);

const babelConfig = {
  presets: compact([
    ifES5(
      ['es2015', { modules: false }],
      null,
    ),
    ...ifESNext([
      ...ifProd([
        ['babili', {
          removeConsole: true,
          removeDebugger: true,
          mangle: false,
          simplify: false,
        }],
        'react-optimize',
      ]),
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
    ],
    ),
    'react',
    'stage-3',
  ]),
  plugins: compact([
    'syntax-dynamic-import',
    ...ifProd([
      'transform-node-env-inline',
      'transform-inline-environment-variables',
    ])
  ]),
  sourceMaps: "both",
};

// Write .babelrc to disk so that it can be used by BabiliPlugin and other plugins
// that do not allow configuration via JS
fs.writeFileSync(
  path.resolve(__dirname, '.babelrc'),
  JSON.stringify(babelConfig, undefined, 2),
);

log(babelConfig);

const babelLoader = {
  loader: 'babel-loader',
  options: babelConfig,
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

const createSVGIconLoaders = name => [
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

const globalCSSLoaders = [
  {
    loader: 'css-loader',
    query: {
      minimize: env.isProd,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: [
        normalize,
        autoprefixer,
      ],
    }
  },
]

const CSSModuleLoaders = [
  {
    loader: 'typings-for-css-modules-loader',
    options: {
      namedExport: true,
      module: true,
      localIdentName: '[name]_[local]_[hash:base64:5]',
      minimize: env.isProd,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: [
        // @WARN Do not include `normalize`
        autoprefixer,
      ],
    }
  },
];

const extractGlobalCSS = new ExtractTextPlugin({
  filename: '[name]_global.[contenthash].css',
  allChunks: true,
});

const extractCSSModules = new ExtractTextPlugin({
  filename: '[name]_local.[contenthash].css',
  allChunks: true,
});

const BUILD_PATH = path.resolve(__dirname, process.env.BUILD_PATH || 'build');
const PUBLIC_PATH = env.isProd ? '' : '/';

module.exports = {
  // bail: env.isProd || env.isTest,

  entry: {
    app: compact([
      ifReact(ifHot('react-hot-loader/patch')),
      ifHot('webpack-hot-middleware/client'),
      path.resolve(__dirname, 'src/index.tsx'),
    ]),
  },

  devServer: env.isDev ? {
    inline: true,
    contentBase: PUBLIC_PATH,
    hot: env.isHot,
  } : undefined,
  devtool: env.isDev ? 'eval' : 'source-map',

  context: path.resolve(__dirname),

  output: {
    path: BUILD_PATH,
    filename: env.isProd ? '[name]_[chunkhash].js' : '[name]_[hash].js',
    publicPath: PUBLIC_PATH,
  },

  performance: env.isProd
    ? {
        hints: 'error',
        maxEntrypointSize: 700000,
        maxAssetSize: 1000000,
      }
    : false,

  module: {
    rules: compact([
      // Stylelint
      ifLint(ifProd({
        test: /\.css$/,
        exclude: excludedPatterns,
        enforce: 'pre',
        use: {
          loader: 'postcss-loader',
          options: {
            plugins: [
              stylelint,
            ],
          },
        },
      })),

      // CSS Modules
      {
        test: /\.module\.css$/,
        exclude: excludedPatterns,
        use: extractCSSModules.extract({
          fallback: 'style-loader',
          use: CSSModuleLoaders,
        }),
      },

      // Global CSS
      {
        test: /\.css$/,
        exclude: [
          ...excludedPatterns,
          /\.module\.css$/,
        ],
        include: [
          path.resolve(__dirname, 'src/layout'),
        ],
        use: extractGlobalCSS.extract({
          fallback: 'style-loader',
          use: globalCSSLoaders,
        }),
      },
  
      // ESLint
      ifLint(ifProd({
        test: /\.jsx?$/,
        exclude: excludedPatterns,
        enforce: 'pre',
        use: [
          {
            loader: 'eslint-loader',
            query: {
              failOnError: env.isProd,
              failOnWarning: env.isProd,
              fix: env.isProd,
            },
          },
        ],
      })),

      // Babel
      {
        test: /\.jsx?$/,
        exclude: excludedPatterns,
        use: compact([
          ifReact(ifHot('react-hot-loader/webpack')),
          babelLoader,
        ]),
      },

      // TSLint
      ifLint(ifProd({
        test: /\.tsx?$/,
        exclude: excludedPatterns,
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader',
            options: {
              emitErrors: env.isProd,
              failOnHint: env.isProd,
              typeCheck: false,
              fix: false,
            },
          },
        ],
      })),

      // TypeScript
      {
        test: /\.tsx?$/,
        exclude: excludedPatterns,
        use: compact([
          ifReact(ifHot('react-hot-loader/webpack')),
          babelLoader,
          {
            loader: 'ts-loader',
            options: {
              silent: true,
              compilerOptions: {
                jsx: 'preserve',
              },
            },
          },
        ]),
      },

      ifTest({
        enforce: 'post',
        test: /\.tsx?$/,
        include: path.resolve(__dirname, 'src'),
        exclude: excludedPatterns,
        use: [
          {
            loader: 'istanbul-instrumenter-loader',
            query: {
              esModules: true,
            },
          },
        ],
      }),

      // SVG Icons
      {
        test: /\.svg$/,
        exclude: excludedPatterns,
        include: [path.resolve(__dirname, 'src/icons')],
        use: createSVGIconLoaders('icons.svg'),
      },
    ]),
  },
  resolve: {
    alias: Object.assign(
      {
        lodash: 'lodash-es',
        'transformation-matrix': 'transformation-matrix/build-es'
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
    // Development
    new webpack.WatchIgnorePlugin([/\.d\.ts$/, /node_modules/]),
    ifHot(new webpack.HotModuleReplacementPlugin()),

    // Error handling
    new webpack.NoEmitOnErrorsPlugin(),

    // Environment
    new webpack.DefinePlugin({
      __DEBUG__: JSON.stringify(env.isDev),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      isHot: JSON.stringify(env.isHot),
    }),
  
    // HTML index
    new WebpackHTMLPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/index.html'),
      inject: 'body',
      minify: env.isProd
        ? {
            html5: true,
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: true,
            collapseWhitespace: true,
          }
        : false,
      excludeAssets: [/\.rtl/i],
    }),

    new PreloadWebpackPlugin({
      rel: 'preload',
      as: 'script',
      include: 'asyncChunks'
    }),

    // CSS
    extractCSSModules,
    extractGlobalCSS,

    // SVG sprites
    new SpriteLoaderPlugin(),

    new webpack.NamedModulesPlugin(),

    // Production-only
    ...ifProd([
      // Chunks
      // See https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
      new webpack.NamedChunksPlugin(),
      new NameAllModulesPlugin(),

      // The order of the following instances is important
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks(module) {
          return (
            module.context &&
            module.context.indexOf('node_modules') !== -1
          );
        },
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'react',
        minChunks(module) {
          if (module.context !== undefined) {
            const relative = path.relative('./node_modules', module.context);
            return (
              module.context.indexOf('node_modules') !== -1 &&
              relative.match(/^p?react/i)
            );
          }
          return false;
        },
      }),
      new webpack.optimize.CommonsChunkPlugin({
        async: true,
        minChunks: Infinity,
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        minChunks: Infinity,
      }),
      new webpack.optimize.AggressiveMergingPlugin({
        moveToParents: true,
      }),
    
      new webpack.optimize.OccurrenceOrderPlugin(true),

      // Minification
      ...ifES5([
        new webpack.optimize.UglifyJsPlugin({
          minimize: true,
          comments: false,
          sourceMap: true,
        }),
      ]),

      ...ifESNext([
        new BabiliPlugin(),
      ]),

      // Banner
      new webpack.BannerPlugin({
        entryOnly: true,
        banner: `${pkg.displayName || pkg.name} hash:[hash], chunkhash:[chunkhash], name:[name]`,
      }),
    ]),
  ]),
};
