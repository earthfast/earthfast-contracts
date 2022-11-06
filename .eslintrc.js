module.exports = {
  env: {
    browser: false,
    es2021: true,
    mocha: true,
    node: true,
  },
  plugins: ["@typescript-eslint"],
  extends: ["standard", "plugin:prettier/recommended", "plugin:node/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    warnOnUnsupportedTypeScriptVersion: false,
  },
  settings: {
    node: {
      tryExtensions: [".js", ".json", ".ts", ".d.ts"],
    },
  },
  rules: {
    "import/order": ["error", { alphabetize: { order: "asc", caseInsensitive: true } }],
    "sort-imports": ["error", { ignoreCase: true, ignoreDeclarationSort: true }],
    "node/no-unsupported-features/es-syntax": ["error", { ignores: ["modules"] }],
  },
  overrides: [
    {
      files: ["test/**/*.ts", "lib/test.ts"],
      rules: { "no-unused-expressions": "off" },
    },
  ],
};
