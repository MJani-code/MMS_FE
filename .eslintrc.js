module.exports = {
  extends: ['eslint:recommended', 'plugin:vue/recommended', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'lf'
      }
    ],
    'vue/multi-word-component-names': 'off',
    'vue/max-attributes-per-line': ['off'],
    'vue/no-deprecated-slot-attribute': 'off',
    'vue/no-deprecated-v-slot-modifiers': 'off',
    'vue/valid-v-slot': 'off',
    "no-unused-vars": "off"
  }
};
