const { compact, zipObject } = require('lodash');
const b2s = require('browserslist-saucelabs');

const { isCI, ifCI } = require('./env');

const COVERAGE_DIR = process.env.COVERAGE_DIR || 'coverage';
const TEST_REPORTS_DIR = process.env.TEST_REPORTS || 'reports';

const sauceBrowsers = b2s().map(c => Object.assign({ base: 'SauceLabs' }, c));
const sauceBrowserNames = sauceBrowsers.map(
  c => `${c.browserName} ${c.version} on ${c.platform}`,
);

const customLaunchers = zipObject(sauceBrowserNames, sauceBrowsers);

module.exports = config => {
  if (isCI && (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY)) {
    console.log(
      'Make sure the SAUCE_USERNAME and ' +
        'SAUCE_ACCESS_KEY environment variables are set.',
    );
    process.exit(1);
  }
  const browsers = isCI ? sauceBrowserNames : ['ChromeHeadless'];
  /* eslint-disable global-require */
  const webpackConfig = require('./webpack.config');
  webpackConfig.devtool = 'inline-source-map';
  webpackConfig.entry = () => ({});
  config.set({
    frameworks: ['mocha', 'source-map-support'],
    files: ['test/index.js'],
    preprocessors: {
      'test/index.js': ['webpack'],
    },
    plugins: compact([
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-source-map-support',
      'karma-junit-reporter',
      'karma-coverage',
      'karma-remap-coverage',
      ifCI('karma-sauce-launcher'),
      'karma-webpack',
    ]),
    reporters: compact([
      'mocha',
      'coverage',
      'remap-coverage',
      ifCI('junit'),
      ifCI('saucelabs'),
    ]),
    mochaReporter: {
      output: 'autowatch',
      showDiff: true,
    },
    junitReporter: {
      outputFile: `${TEST_REPORTS_DIR}/junit/test-results.xml`,
    },
    coverageReporter: {
      type: 'in-memory',
    },
    remapCoverageReporter: {
      'text-summary': null,
      html: `${COVERAGE_DIR}/html`,
      json: `${COVERAGE_DIR}/coverage.json`,
      lcovonly: `${COVERAGE_DIR}/coverage.lcov`,
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_ERROR,
    browsers,
    singleRun: false,
    concurrency: Infinity,
    webpack: webpackConfig,
    customLaunchers,
    webpackServer: {
      stats: {
        chunks: false,
      },
      noInfo: true,
    },
    sauceLabs: {
      testName: 'WebCeph',
      recordScreenshots: true,
      connectOptions: {
        port: 5757,
        logfile: 'sauce_connect.log',
        tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
      },
      public: 'public',
    },
  });
};
