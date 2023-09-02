/* eslint-env node */
module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  ignorePatterns: ["public/**/*", "node_modules/**/*", ".cache/**/*"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/triple-slash-reference": "off",
  },
};
