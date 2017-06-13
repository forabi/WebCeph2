const { compact } = require('lodash');

exports.isTest = process.env.NODE_ENV === 'test';
exports.isProduction = process.env.NODE_ENV === 'production';
exports.isCI = Boolean(process.env.CI);
exports.isDevelopment = exports.isTest || process.env.NODE_ENV === 'development';
exports.isDev = exports.isDevelopment;
exports.isProd = exports.isProduction;
exports.isHot = Boolean(process.env.HOT);
exports.isBrowser = !process && typeof window !== 'undefined';
exports.isPreact = !process.env.REACT;
exports.isInferno = !exports.isPreact && Boolean(process.env.INFERNO);
exports.isReact = !exports.isPreact && !exports.isInferno;
exports.isES5 = Boolean(process.env.ES5);
exports.isESNext = !exports.isES5;
exports.shouldLint = process.env.LINT === undefined || Boolean(process.env.LINT);

const createConditionalWithFallback = 
  (condition, defaultFallback = undefined) =>
    (p, fallback = defaultFallback) => {
      if (Array.isArray(p)) {
        return condition ? compact(p) : fallback || [];
      }
      return condition ? p : fallback;
    };

exports.ifProd = createConditionalWithFallback(exports.isProd);
exports.ifHot = createConditionalWithFallback(exports.isHot);
exports.ifTest = createConditionalWithFallback(exports.isTest);
exports.ifDev = createConditionalWithFallback(exports.isDev);
exports.ifReact = createConditionalWithFallback(exports.isReact);
exports.ifPreact = createConditionalWithFallback(exports.isPreact);
exports.ifInferno = createConditionalWithFallback(exports.isInferno);
exports.ifES5 = createConditionalWithFallback(exports.isES5);
exports.ifLint = createConditionalWithFallback(exports.shouldLint);
exports.ifESNext = createConditionalWithFallback(exports.isESNext);
exports.ifCI = createConditionalWithFallback(exports.isCI);
