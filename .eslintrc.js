const fabric = require('@umijs/fabric'); // eslint-disable-line

module.exports = {
  ...fabric.eslint,

  parser: '@babel/eslint-parser',

  plugins: ['eslint-comments', 'react', 'react-hooks'],

  extends: ['eslint-config-airbnb-base', 'prettier', 'plugin:react/recommended'],

  /**
   * 自定义校验规则
   * 0 => off, 1 => warn, 2 => error
   */
  rules: {
    'react/display-name': 0,
    'react/prop-types': 0,
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0,
    'no-param-reassign': 0,
    'import/prefer-default-export': 0,
    'react/react-in-jsx-scope': 0,
    'import/extensions': 0,
  },
};
