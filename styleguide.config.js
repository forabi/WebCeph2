const path = require('path');
const glob = require('glob');

module.exports = {
  title: 'WebCeph Style Guide',
  components() {
    return glob
      .sync(path.resolve(__dirname, 'src/components/**/*.tsx'))
      .filter(module => {
        return /\/[A-Z]\w*\.tsx$/.test(module);
      });
  },
  resolver: require('react-docgen').resolver.findAllComponentDefinitions,

  //propsParser: require('../../lib/propTypesParser').parse,
  propsParser: require('react-docgen-typescript').parse,
};
