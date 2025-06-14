import { dropdownOptionType } from "@/components/common/dropdowns/dropdown.type";

export const talentsOptions: dropdownOptionType<
  dropdownOptionType<number>[]
>[] = [
  {
    label: "IT/프로그래밍",
    value: [
      {
        label: "React",
        value: 1001,
      },
      {
        label: "HTML",
        value: 1002,
      },
      {
        label: "CSS",
        value: 1003,
      },
      {
        label: "JavaScript",
        value: 1004,
      },
      {
        label: "TypeScript",
        value: 1005,
      },
      {
        label: "Sass",
        value: 1006,
      },
      {
        label: "Dart",
        value: 1007,
      },
      {
        label: "JSON",
        value: 1008,
      },
      {
        label: "Swift",
        value: 1009,
      },
      {
        label: "Python",
        value: 1010,
      },
      {
        label: "Java",
        value: 1011,
      },
      {
        label: "PHP",
        value: 1012,
      },
      {
        label: "Ruby",
        value: 1013,
      },
      {
        label: "C#",
        value: 1014,
      },
      {
        label: "Rust",
        value: 1015,
      },
      {
        label: "Perl",
        value: 1016,
      },
      {
        label: "Kotlin",
        value: 1017,
      },
      {
        label: "R",
        value: 1018,
      },
      {
        label: "SQL",
        value: 1019,
      },
      {
        label: "Julia",
        value: 1020,
      },
      {
        label: "MATLAB",
        value: 1021,
      },
      {
        label: "Scala",
        value: 1022,
      },
      {
        label: "C++",
        value: 1023,
      },
      {
        label: "Go",
        value: 1024,
      },
      {
        label: "컴퓨터 언어",
        value: 1025,
      },
      {
        label: "AI 툴 활용",
        value: 1026,
      },
      {
        label: "프롬프트 엔지니어링",
        value: 1027,
      },
      {
        label: "그 외 IT/프로그래밍 관련",
        value: 1999,
      },
    ],
  },
  {
    label: "디자인",
    value: [
      {
        label: "로고 디자인",
        value: 2001,
      },
      {
        label: "UX/UI 디자인",
        value: 2002,
      },
      {
        label: "패키지 디자인",
        value: 2003,
      },
      {
        label: "브랜드 디자인",
        value: 2004,
      },
      {
        label: "웹 디자인",
        value: 2005,
      },
      {
        label: "일러스트 디자인",
        value: 2006,
      },
      {
        label: "애니메이션",
        value: 2007,
      },
      {
        label: "그 외 디자인관련",
        value: 2999,
      },
    ],
  },
  {
    label: "상담",
    value: [
      {
        label: "취업 상담",
        value: 3001,
      },
      {
        label: "고민 상담",
        value: 3002,
      },
      {
        label: "연애 상담",
        value: 3003,
      },
      {
        label: "진로 상담",
        value: 3004,
      },
      {
        label: "그 외 상담관련",
        value: 3999,
      },
    ],
  },
  {
    label: "언어(회화)",
    value: [
      {
        label: "영어 회화",
        value: 4001,
      },
      {
        label: "일본어 회화",
        value: 4002,
      },
      {
        label: "중국어 회화",
        value: 4003,
      },
      {
        label: "스페인어 회화",
        value: 4004,
      },
      {
        label: "프랑스어 회화",
        value: 4005,
      },
      {
        label: "독일어 회화",
        value: 4006,
      },
      {
        label: "태국어 회화",
        value: 4007,
      },
      {
        label: "이탈리아어 회화",
        value: 4008,
      },
      {
        label: "그 외 회화관련",
        value: 4999,
      },
    ],
  },
  {
    label: "운동",
    value: [
      {
        label: "헬스PT/식단",
        value: 5001,
      },
      {
        label: "요가",
        value: 5002,
      },
      {
        label: "필라테스",
        value: 5003,
      },
      {
        label: "수영",
        value: 5004,
      },
      {
        label: "테니스",
        value: 5005,
      },
      {
        label: "골프",
        value: 5006,
      },
      {
        label: "축구",
        value: 5007,
      },
      {
        label: "배드민턴",
        value: 5008,
      },
      {
        label: "볼링",
        value: 5009,
      },
      {
        label: "그 외 운동관련",
        value: 5999,
      },
    ],
  },
  {
    label: "사진/영상",
    value: [
      {
        label: "사진 촬영",
        value: 6001,
      },
      {
        label: "영상 편집",
        value: 6002,
      },
      {
        label: "드론 촬영",
        value: 6003,
      },
      {
        label: "제품 사진",
        value: 6004,
      },
      {
        label: "인물 사진",
        value: 6005,
      },
      {
        label: "풍경 사진",
        value: 6006,
      },
      {
        label: "유튜브 제작",
        value: 6007,
      },
      {
        label: "그 외 사진/영상관련",
        value: 6999,
      },
    ],
  },
  {
    label: "패션/뷰티",
    value: [
      {
        label: "메이크업",
        value: 7001,
      },
      {
        label: "헤어 스타일링",
        value: 7002,
      },
      {
        label: "패션 스타일링",
        value: 7003,
      },
      {
        label: "스킨케어",
        value: 7004,
      },
      {
        label: "네일 아트",
        value: 7005,
      },
      {
        label: "퍼스널 컬러 분석",
        value: 7006,
      },
      {
        label: "의상 코디",
        value: 7007,
      },
      {
        label: "바디 스타일링",
        value: 7008,
      },
      {
        label: "그 외 패션/뷰티관련",
        value: 7999,
      },
    ],
  },
  {
    label: "마케팅 직무",
    value: [
      {
        label: "디지털 마케팅",
        value: 8001,
      },
      {
        label: "콘텐츠 마케팅",
        value: 8002,
      },
      {
        label: "퍼포먼스 마케팅",
        value: 8003,
      },
      {
        label: "브랜드 마케팅",
        value: 8004,
      },
      {
        label: "마케팅 전략",
        value: 8005,
      },
      {
        label: "SNS 마케팅",
        value: 8006,
      },
      {
        label: "광고 기획",
        value: 8007,
      },
      {
        label: "이벤트 기획",
        value: 8008,
      },
      {
        label: "시장 조사",
        value: 8009,
      },
      {
        label: "그 외 마케팅 직무관련",
        value: 8999,
      },
    ],
  },
  {
    label: "요리",
    value: [
      {
        label: "한식 조리",
        value: 9001,
      },
      {
        label: "양식 조리",
        value: 9002,
      },
      {
        label: "중식 조리",
        value: 9003,
      },
      {
        label: "일식 조리",
        value: 9004,
      },
      {
        label: "제과제빵",
        value: 9005,
      },
      {
        label: "푸드 스타일링",
        value: 9006,
      },
      {
        label: "그 외 요리관련",
        value: 9999,
      },
    ],
  },
  {
    label: "음악",
    value: [
      {
        label: "기타 연주",
        value: 10001,
      },
      {
        label: "피아노 연주",
        value: 10002,
      },
      {
        label: "바이올린 연주",
        value: 10003,
      },
      {
        label: "드럼 연주",
        value: 10004,
      },
      {
        label: "보컬 트레이닝",
        value: 10005,
      },
      {
        label: "작곡/편곡",
        value: 10006,
      },
      {
        label: "음향 믹싱",
        value: 10007,
      },
      {
        label: "음악 프로듀싱",
        value: 10008,
      },
      {
        label: "재즈 연주",
        value: 10009,
      },
      {
        label: "그 외 음악관련",
        value: 10999,
      },
    ],
  },
  {
    label: "예술",
    value: [
      {
        label: "드로잉",
        value: 11001,
      },
      {
        label: "조각",
        value: 11002,
      },
      {
        label: "도예",
        value: 11003,
      },
      {
        label: "캘리그라피",
        value: 11004,
      },
      {
        label: "디지털 아트",
        value: 11005,
      },
      {
        label: "그 외 예술관련",
        value: 11999,
      },
    ],
  },
  {
    label: "재테크",
    value: [
      {
        label: "주식 투자",
        value: 12001,
      },
      {
        label: "부동산 투자",
        value: 12002,
      },
      {
        label: "연금 관리",
        value: 12003,
      },
      {
        label: "가상화폐",
        value: 12004,
      },
      {
        label: "세금 관리",
        value: 12005,
      },
      {
        label: "채권 투자",
        value: 12006,
      },
      {
        label: "포트폴리오 관리",
        value: 12007,
      },
      {
        label: "그 외 재테크관련",
        value: 12999,
      },
    ],
  },
  {
    label: "육아",
    value: [
      {
        label: "영유아 발달",
        value: 13001,
      },
      {
        label: "학습 지원",
        value: 13002,
      },
      {
        label: "식습관 교육",
        value: 13003,
      },
      {
        label: "부모 상담",
        value: 13004,
      },
      {
        label: "심리 발달",
        value: 13005,
      },
      {
        label: "사회성 교육",
        value: 13006,
      },
      {
        label: "그 외 육아관련",
        value: 13999,
      },
    ],
  },
  {
    label: "글쓰기",
    value: [
      {
        label: "소설 쓰기",
        value: 14001,
      },
      {
        label: "논술 작성",
        value: 14002,
      },
      {
        label: "블로그 글쓰기",
        value: 14003,
      },
      {
        label: "홍보 글쓰기",
        value: 14004,
      },
      {
        label: "시나리오 작성",
        value: 14005,
      },
      {
        label: "그 외 글쓰기 관련",
        value: 14999,
      },
    ],
  },
  {
    label: "댄스",
    value: [
      {
        label: "방송댄스",
        value: 15001,
      },
      {
        label: "힙합.스트릿댄스",
        value: 15002,
      },
      {
        label: "발레.체조.폴댄스",
        value: 15003,
      },
      {
        label: "그 외 댄스 관련",
        value: 15999,
      },
    ],
  },
];
