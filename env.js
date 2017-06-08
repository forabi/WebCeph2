const isTest = process.env.NODE_ENV === 'test';

exports.isProduction = process.env.NODE_ENV === 'production';
exports.isCI = Boolean(process.env.CI);
exports.isTest = isTest;
exports.isDevelopment = isTest || process.env.NODE_ENV === 'development';
exports.isDev = exports.isDevelopment;
exports.isProd = exports.isProduction;
exports.isHot = Boolean(process.env.HOT);
exports.isBrowser = !process && typeof window !== 'undefined';
exports.isPreact = Boolean(process.env.PREACT);
exports.isInferno = !exports.isPreact && Boolean(process.env.INFERNO);
exports.isReact = !exports.isPreact && !exports.isInferno;

const createConditionalWithFallback = (
  condition,
  defaultFallback = undefined,
) => (p, fallback = defaultFallback) => (condition ? p : fallback);

exports.ifProd = createConditionalWithFallback(exports.isProd);
exports.ifHot = createConditionalWithFallback(exports.isHot);
exports.ifTest = createConditionalWithFallback(exports.isTest);
exports.ifDev = (p, fallback = undefined) => (exports.isDev ? p : fallback);
exports.ifReact = createConditionalWithFallback(exports.isReact);
exports.ifPreact = createConditionalWithFallback(exports.isPreact);
exports.ifInferno = createConditionalWithFallback(exports.isInferno);
