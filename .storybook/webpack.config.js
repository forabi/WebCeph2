const localConfig = require('../webpack.config');

module.exports = Object.assign({}, localConfig, {
  plugins: [...localConfig.plugins],
  module: Object.assign({}, localConfig.module, {
    loaders: [...localConfig.module.rules],
  }),
});
