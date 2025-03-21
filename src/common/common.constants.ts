export enum queryKeys {
  USER = "USER",
  MATCHING = "MATCHING",
  COMMUNITY = "COMMUNITY",
  COMMUNITY_COMMENT = "COMMUNITY_COMMENT",
  COMMUNITY_REPLY = "COMMUNITY_REPLY"
}

export const CATEGORIZED_TALENTS_LIST: {
  categoryCode: number;
  categoryName: string;
  talents: { talentCode: number; talentName: string }[];
}[] = [
  {
    categoryCode: 1000,
    categoryName: "IT/프로그래밍",
    talents: [
      {
        talentCode: 1001,
        talentName: "React"
      },
      {
        talentCode: 1002,
        talentName: "HTML"
      },
      {
        talentCode: 1003,
        talentName: "CSS"
      },
      {
        talentCode: 1004,
        talentName: "JavaScript"
      },
      {
        talentCode: 1005,
        talentName: "TypeScript"
      },
      {
        talentCode: 1006,
        talentName: "Sass"
      },
      {
        talentCode: 1007,
        talentName: "Dart"
      },
      {
        talentCode: 1008,
        talentName: "JSON"
      },
      {
        talentCode: 1009,
        talentName: "Swift"
      },
      {
        talentCode: 1010,
        talentName: "Python"
      },
      {
        talentCode: 1011,
        talentName: "Java"
      },
      {
        talentCode: 1012,
        talentName: "PHP"
      },
      {
        talentCode: 1013,
        talentName: "Ruby"
      },
      {
        talentCode: 1014,
        talentName: "C#"
      },
      {
        talentCode: 1015,
        talentName: "Rust"
      },
      {
        talentCode: 1016,
        talentName: "Perl"
      },
      {
        talentCode: 1017,
        talentName: "Kotlin"
      },
      {
        talentCode: 1018,
        talentName: "R"
      },
      {
        talentCode: 1019,
        talentName: "SQL"
      },
      {
        talentCode: 1020,
        talentName: "Julia"
      },
      {
        talentCode: 1021,
        talentName: "MATLAB"
      },
      {
        talentCode: 1022,
        talentName: "Scala"
      },
      {
        talentCode: 1023,
        talentName: "C++"
      },
      {
        talentCode: 1024,
        talentName: "Go"
      },
      {
        talentCode: 1025,
        talentName: "컴퓨터 언어"
      },
      {
        talentCode: 1026,
        talentName: "AI 툴 활용"
      },
      {
        talentCode: 1027,
        talentName: "프롬프트 엔지니어링"
      },
      {
        talentCode: 1999,
        talentName: "그 외 IT/프로그래밍 관련"
      }
    ]
  },
  {
    categoryCode: 2000,
    categoryName: "디자인",
    talents: [
      {
        talentCode: 2001,
        talentName: "로고 디자인"
      },
      {
        talentCode: 2002,
        talentName: "UX/UI 디자인"
      },
      {
        talentCode: 2003,
        talentName: "패키지 디자인"
      },
      {
        talentCode: 2004,
        talentName: "브랜드 디자인"
      },
      {
        talentCode: 2005,
        talentName: "웹 디자인"
      },
      {
        talentCode: 2006,
        talentName: "일러스트 디자인"
      },
      {
        talentCode: 2007,
        talentName: "애니메이션"
      },
      {
        talentCode: 2999,
        talentName: "그 외 디자인관련"
      }
    ]
  },
  {
    categoryCode: 3000,
    categoryName: "상담",
    talents: [
      {
        talentCode: 3001,
        talentName: "취업 상담"
      },
      {
        talentCode: 3002,
        talentName: "고민 상담"
      },
      {
        talentCode: 3003,
        talentName: "연애 상담"
      },
      {
        talentCode: 3004,
        talentName: "진로 상담"
      },
      {
        talentCode: 3999,
        talentName: "그 외 상담관련"
      }
    ]
  },
  {
    categoryCode: 4000,
    categoryName: "언어(회화)",
    talents: [
      {
        talentCode: 4001,
        talentName: "영어 회화"
      },
      {
        talentCode: 4002,
        talentName: "일본어 회화"
      },
      {
        talentCode: 4003,
        talentName: "중국어 회화"
      },
      {
        talentCode: 4004,
        talentName: "스페인어 회화"
      },
      {
        talentCode: 4005,
        talentName: "프랑스어 회화"
      },
      {
        talentCode: 4006,
        talentName: "독일어 회화"
      },
      {
        talentCode: 4007,
        talentName: "태국어 회화"
      },
      {
        talentCode: 4008,
        talentName: "이탈리아어 회화"
      },
      {
        talentCode: 4999,
        talentName: "그 외 회화관련"
      }
    ]
  },
  {
    categoryCode: 5000,
    categoryName: "운동",
    talents: [
      {
        talentCode: 5001,
        talentName: "헬스PT/식단"
      },
      {
        talentCode: 5002,
        talentName: "요가"
      },
      {
        talentCode: 5003,
        talentName: "필라테스"
      },
      {
        talentCode: 5004,
        talentName: "수영"
      },
      {
        talentCode: 5005,
        talentName: "테니스"
      },
      {
        talentCode: 5006,
        talentName: "골프"
      },
      {
        talentCode: 5007,
        talentName: "축구"
      },
      {
        talentCode: 5008,
        talentName: "배드민턴"
      },
      {
        talentCode: 5009,
        talentName: "볼링"
      },
      {
        talentCode: 5999,
        talentName: "그 외 운동관련"
      }
    ]
  },
  {
    categoryCode: 6000,
    categoryName: "사진/영상",
    talents: [
      {
        talentCode: 6001,
        talentName: "사진 촬영"
      },
      {
        talentCode: 6002,
        talentName: "영상 편집"
      },
      {
        talentCode: 6003,
        talentName: "드론 촬영"
      },
      {
        talentCode: 6004,
        talentName: "제품 사진"
      },
      {
        talentCode: 6005,
        talentName: "인물 사진"
      },
      {
        talentCode: 6006,
        talentName: "풍경 사진"
      },
      {
        talentCode: 6007,
        talentName: "유튜브 제작"
      },
      {
        talentCode: 6999,
        talentName: "그 외 사진/영상관련"
      }
    ]
  },
  {
    categoryCode: 7000,
    categoryName: "패션/뷰티",
    talents: [
      {
        talentCode: 7001,
        talentName: "메이크업"
      },
      {
        talentCode: 7002,
        talentName: "헤어 스타일링"
      },
      {
        talentCode: 7003,
        talentName: "패션 스타일링"
      },
      {
        talentCode: 7004,
        talentName: "스킨케어"
      },
      {
        talentCode: 7005,
        talentName: "네일 아트"
      },
      {
        talentCode: 7006,
        talentName: "퍼스널 컬러 분석"
      },
      {
        talentCode: 7007,
        talentName: "의상 코디"
      },
      {
        talentCode: 7008,
        talentName: "바디 스타일링"
      },
      {
        talentCode: 7999,
        talentName: "그 외 패션/뷰티관련"
      }
    ]
  },
  {
    categoryCode: 8000,
    categoryName: "마케팅 직무",
    talents: [
      {
        talentCode: 8001,
        talentName: "디지털 마케팅"
      },
      {
        talentCode: 8002,
        talentName: "콘텐츠 마케팅"
      },
      {
        talentCode: 8003,
        talentName: "퍼포먼스 마케팅"
      },
      {
        talentCode: 8004,
        talentName: "브랜드 마케팅"
      },
      {
        talentCode: 8005,
        talentName: "마케팅 전략"
      },
      {
        talentCode: 8006,
        talentName: "SNS 마케팅"
      },
      {
        talentCode: 8007,
        talentName: "광고 기획"
      },
      {
        talentCode: 8008,
        talentName: "이벤트 기획"
      },
      {
        talentCode: 8009,
        talentName: "시장 조사"
      },
      {
        talentCode: 8999,
        talentName: "그 외 마케팅 직무관련"
      }
    ]
  },
  {
    categoryCode: 9000,
    categoryName: "요리",
    talents: [
      {
        talentCode: 9001,
        talentName: "한식 조리"
      },
      {
        talentCode: 9002,
        talentName: "양식 조리"
      },
      {
        talentCode: 9003,
        talentName: "중식 조리"
      },
      {
        talentCode: 9004,
        talentName: "일식 조리"
      },
      {
        talentCode: 9005,
        talentName: "제과제빵"
      },
      {
        talentCode: 9006,
        talentName: "푸드 스타일링"
      },
      {
        talentCode: 9999,
        talentName: "그 외 요리관련"
      }
    ]
  },
  {
    categoryCode: 10000,
    categoryName: "음악",
    talents: [
      {
        talentCode: 10001,
        talentName: "기타 연주"
      },
      {
        talentCode: 10002,
        talentName: "피아노 연주"
      },
      {
        talentCode: 10003,
        talentName: "바이올린 연주"
      },
      {
        talentCode: 10004,
        talentName: "드럼 연주"
      },
      {
        talentCode: 10005,
        talentName: "보컬 트레이닝"
      },
      {
        talentCode: 10006,
        talentName: "작곡/편곡"
      },
      {
        talentCode: 10007,
        talentName: "음향 믹싱"
      },
      {
        talentCode: 10008,
        talentName: "음악 프로듀싱"
      },
      {
        talentCode: 10009,
        talentName: "재즈 연주"
      },
      {
        talentCode: 10999,
        talentName: "그 외 음악관련"
      }
    ]
  },
  {
    categoryCode: 11000,
    categoryName: "예술",
    talents: [
      {
        talentCode: 11001,
        talentName: "드로잉"
      },
      {
        talentCode: 11002,
        talentName: "조각"
      },
      {
        talentCode: 11003,
        talentName: "도예"
      },
      {
        talentCode: 11004,
        talentName: "캘리그라피"
      },
      {
        talentCode: 11005,
        talentName: "디지털 아트"
      },
      {
        talentCode: 11999,
        talentName: "그 외 예술관련"
      }
    ]
  },
  {
    categoryCode: 12000,
    categoryName: "재테크",
    talents: [
      {
        talentCode: 12001,
        talentName: "주식 투자"
      },
      {
        talentCode: 12002,
        talentName: "부동산 투자"
      },
      {
        talentCode: 12003,
        talentName: "연금 관리"
      },
      {
        talentCode: 12004,
        talentName: "가상화폐"
      },
      {
        talentCode: 12005,
        talentName: "세금 관리"
      },
      {
        talentCode: 12006,
        talentName: "채권 투자"
      },
      {
        talentCode: 12007,
        talentName: "포트폴리오 관리"
      },
      {
        talentCode: 12999,
        talentName: "그 외 재테크관련"
      }
    ]
  },
  {
    categoryCode: 13000,
    categoryName: "육아",
    talents: [
      {
        talentCode: 13001,
        talentName: "영유아 발달"
      },
      {
        talentCode: 13002,
        talentName: "학습 지원"
      },
      {
        talentCode: 13003,
        talentName: "식습관 교육"
      },
      {
        talentCode: 13004,
        talentName: "부모 상담"
      },
      {
        talentCode: 13005,
        talentName: "심리 발달"
      },
      {
        talentCode: 13006,
        talentName: "사회성 교육"
      },
      {
        talentCode: 13999,
        talentName: "그 외 육아관련"
      }
    ]
  },
  {
    categoryCode: 14000,
    categoryName: "글쓰기",
    talents: [
      {
        talentCode: 14001,
        talentName: "소설 쓰기"
      },
      {
        talentCode: 14002,
        talentName: "논술 작성"
      },
      {
        talentCode: 14003,
        talentName: "블로그 글쓰기"
      },
      {
        talentCode: 14004,
        talentName: "홍보 글쓰기"
      },
      {
        talentCode: 14005,
        talentName: "시나리오 작성"
      },
      {
        talentCode: 14999,
        talentName: "그 외 글쓰기 관련"
      }
    ]
  },
  {
    categoryCode: 15000,
    categoryName: "댄스",
    talents: [
      {
        talentCode: 15001,
        talentName: "방송댄스"
      },
      {
        talentCode: 15002,
        talentName: "힙합.스트릿댄스"
      },
      {
        talentCode: 15003,
        talentName: "발레.체조.폴댄스"
      },
      {
        talentCode: 15999,
        talentName: "그 외 댄스 관련"
      }
    ]
  }
];
