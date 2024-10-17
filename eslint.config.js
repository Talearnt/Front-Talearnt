import eslint from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks'
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths"
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    extends: [  eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylistic
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      "no-relative-import-paths":noRelativeImportPaths,
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      'no-duplicate-imports': [
        'error',
        {
          includeExports: true,
        },
      ],
      'object-shorthand': [
        'error',
        'always',
        {
          avoidQuotes: true,
        },
      ],
      "prefer-destructuring": [
        "error",
        {
          "VariableDeclarator": {
            "array": false,
            "object": true
          },
          "AssignmentExpression": {
            "array": false,
            "object": false
          }
        }
      ],
      "no-relative-import-paths/no-relative-import-paths": [
        "warn",
        { "allowSameFolder": true, "rootDir": "src", "prefix": "@" }
      ],
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          "selector": "variable",
          "format": ["strictCamelCase", "UPPER_CASE"]
        },
        {
          "selector": "function",
          "format": ["strictCamelCase", "PascalCase"]
        },
        {
          "selector": "parameter",
          "format": ["strictCamelCase"]
        },
        {
          "selector": "typeAlias",
          "format": ["PascalCase"],
          "suffix": ["Type", "Props"]
        },
      ]
    },
  },
  {
    files: ['**/*.js'],
    ...tseslint.configs.disableTypeChecked,
  },
);