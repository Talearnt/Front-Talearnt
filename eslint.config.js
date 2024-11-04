import eslintConfigPrettier from "eslint-config-prettier";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";
import eslint from "@eslint/js";

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
      ecmaVersion: 2020, // 사용하는 ECMAScript 버전 설정
      parser: tseslint.parser, // TypeScript를 위한 파서 설정
      parserOptions: {
        projectService: true, // TypeScript 프로젝트 서비스 사용 여부
        tsconfigRootDir: import.meta.dirname // tsconfig.json 파일의 경로
      }
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "no-relative-import-paths": noRelativeImportPaths, // 상대 경로 import를 금지하는 플러그인
      "react-hooks": reactHooks, // React Hooks 관련 규칙 플러그인
      "simple-import-sort": simpleImportSort // import 정렬 플러그인
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true // node_modules/@types에서도 모듈을 찾습니다.
        }
      }
    },
    rules: {
      ...reactHooks.configs.recommended.rules, // React Hooks 규칙 가져오기
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/prefer-promise-reject-errors": "off",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // 1. React 관련 패키지
            ["^react"],

            // 2. 라이브러리
            ["^[@\\w]"],

            // 3. api 파일
            ["^.+\\.api$"],

            // 4. util 함수
            ["^@utils/.*|^.*/(util|.*.util)$"],

            // 5. custom hook
            ["^.*/(hook|.*.hook)$"],

            // 6. 페이지
            ["^.*/(?!.*.css$)[A-Z].*$"],

            // 7. 컴포넌트
            ["^.+/components/.*/[A-Z].*$"],

            // 8. json, 상수
            ["^.+\\.(json|constants)$"],

            // 9. 이미지
            ["^.+\\.(svg)$"],

            // 10. 타입
            ["^.+\\.type$"],

            // 11. css
            ["^.+\\.(css|scss)$"]
          ]
        }
      ],
      "simple-import-sort/exports": "error",
      "no-duplicate-imports": [
        "error",
        {
          includeExports: true // 중복 import에 대한 오류 처리
        }
      ],
      "object-shorthand": [
        "error",
        "always",
        {
          avoidQuotes: true // 객체 축약형 사용
        }
      ],
      "prefer-destructuring": [
        "error",
        {
          VariableDeclarator: {
            array: false,
            object: true // 객체 구조 분해를 선호하는 규칙
          },
          AssignmentExpression: {
            array: false,
            object: false
          }
        }
      ],
      "no-relative-import-paths/no-relative-import-paths": [
        "warn",
        { allowSameFolder: true, rootDir: "src" }
      ],
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE"] // 변수 이름 규칙
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"] // 함수 이름 규칙
        },
        {
          selector: "parameter",
          format: ["camelCase"] // 파라미터 이름 규칙
        },
        {
          selector: "typeAlias",
          format: ["camelCase", "PascalCase"],
          suffix: ["Type", "Props"] // 타입 이름 규칙
        }
      ]
    }
  },
  {
    files: ["**/*.js"],
    ...tseslint.configs.disableTypeChecked
  }
];
