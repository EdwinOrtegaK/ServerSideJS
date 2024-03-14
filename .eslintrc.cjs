module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    "semi": ["error", "never"], // Prohibir el uso de punto y coma
    "object-curly-newline": "off", //Desactivar object-curly-newline por conflicto
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "ignorePackages" //Set import/extensions to never because of ERR_MODULE_NOT_FOUND when eliminating ".js" extensions from file imports
      }
    ],
    "no-console": 0
  },
};
