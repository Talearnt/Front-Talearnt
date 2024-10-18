import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylistic,
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "no-relative-import-paths": noRelativeImportPaths,
      "react-hooks": reactHooks,
      "simple-import-sort": simpleImportSort
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // 1. React 관련 패키지
            ["^react"],

            // 2. 라이브러리
            ["^\\w"],

            // 3. api 파일
            ["^.+\\.api$"],

            // 4. util 함수
            ["^.*/(util|.*.util)$"],

            // 5. custom hook
            ["^.*/(hook|.*.hook)$"],

            // 6. 컴포넌트
            ["^.+/components/.*/[A-Z].*$"],

            // 7. json, 상수
            ["^.+\\.(json|constants)$"],

            // 8. 이미지
            ["^.+\\.(svg)$"],

            // 9. 타입
            ["^.+\\.type$"],

            // 10. css
            ["^.+\\.(css|scss)$"]
          ]
        }
      ],
      "simple-import-sort/exports": "error",
      "no-duplicate-imports": [
        "error",
        {
          includeExports: true
        }
      ],
      "object-shorthand": [
        "error",
        "always",
        {
          avoidQuotes: true
        }
      ],
      "prefer-destructuring": [
        "error",
        {
          VariableDeclarator: {
            array: false,
            object: true
          },
          AssignmentExpression: {
            array: false,
            object: false
          }
        }
      ],
      "no-relative-import-paths/no-relative-import-paths": [
        "warn",
        { allowSameFolder: true, rootDir: "src", prefix: "@" }
      ],
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "variable",
          format: ["strictCamelCase", "UPPER_CASE"]
        },
        {
          selector: "function",
          format: ["strictCamelCase", "PascalCase"]
        },
        {
          selector: "parameter",
          format: ["strictCamelCase"]
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"],
          suffix: ["Type", "Props"]
        }
      ]
    }
  },
  {
    files: ["**/*.js"],
    ...tseslint.configs.disableTypeChecked
  }
];
