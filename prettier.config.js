export default {
  arrowParens: "avoid", //화살표 함수의 매개변수가 하나일 경우 괄호를 포함할지 여부
  bracketSameLine: false, //JSX에서 마지막 열린 괄호를 같은 줄에 배치할지 여부
  bracketSpacing: true, //객체 리터럴의 중괄호 내부에 공백을 추가할지 여부
  jsxSingleQuote: false, //JSX에서 문자열을 정의할 때 단일 따옴표를 사용할지 여부
  printWidth: 80, //한 줄의 최대 길이, 초과할 경우 자동으로 줄 바꿈
  semi: true, //문장 끝에 세미콜론을 추가할지 여부
  singleQuote: false, //문자열을 정의할 때 단일 따옴표를 사용할지 여부
  tabWidth: 2, //탭의 너비
  trailingComma: "none", //객체나 배열의 마지막 요소 뒤에 쉼표를 추가할지 여부
  useTabs: false, //공백 대신 탭을 사용할지 여부
  overrides: [
    {
      files: ["*.html", "*.scss", "*.ts", "*.tsx", "*.json", "*.yml", "*.js"]
    }
  ]
};
