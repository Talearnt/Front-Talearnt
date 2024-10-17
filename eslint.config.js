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
            ["^react", "^@?\\w"],

            // 2. 라이브러리
            ["^\\w"], // 기본 패키지 (예: lodash, axios 등)

            // 3. api 파일 (파일 명이 **.api로 시작)
            ["^.+\\.api$"],

            // 4. util 함수 (카멜케이스로 함수명, **.utils일 수도 있고 아닐 수도 있음)
            ["^.+\\.(utils|[a-z]+[A-Z].*)$"], // .utils로 끝나거나 카멜케이스 함수명

            // 5. custom hook (파일 명이 **.hook)
            ["^.+\\.hook$"],

            // 6. 컴포넌트
            ["^.+[A-Z].*"],

            // 7. json이나 상수들
            ["^.+\\.(json|constants)$"], // JSON 파일이나 상수 관련 파일

            // 8. 타입 파일 (파일명이 .type로 끝나는 경우)
            ["^.+\\.type$"],

            // 9. css/scss 파일
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
