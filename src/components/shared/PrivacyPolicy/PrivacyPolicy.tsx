function PrivacyPolicy() {
  return (
    <div className="space-y-6">
      {/* 제1조 개인정보의 처리 목적 */}
      <section>
        <h2 className="mb-4 border-b-2 border-talearnt_Primary_01 pb-2 text-body1_18_semibold text-talearnt_Text_01">
          제1조 (개인정보의 처리 목적)
        </h2>

        <div className="space-y-1 text-body3_14_medium text-talearnt_Text_02">
          <p>
            Talearnt(이하 "회사")는 다음의 목적을 위해 필요한 최소한의
            개인정보를 처리하고 있습니다. 처리하고 있는 개인정보는 다음 목적
            이외의 용도로는 이용되지 않으며, 이용 목적이 변경될 경우 별도의
            동의를 받는 등 필요한 조치를 이행할 것입니다.
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <h4 className="mb-2 font-medium text-talearnt_Text_01">
                1. 회원 가입 및 서비스 이용 관리
              </h4>
              <p>
                회원 가입 의사 확인, 서비스 이용 및 관리, 이용자 식별, 본인
                확인, 불량 회원의 부정 이용 방지 및 제재, 비인가 사용 방지, 가입
                및 탈퇴 의사 확인 등
              </p>
            </div>

            <div>
              <h4 className="mb-2 font-medium text-talearnt_Text_01">
                2. 서비스 제공 및 운영
              </h4>
              <p>
                매칭 서비스 제공, 커뮤니티 활동 지원, 콘텐츠 등록/관리, 공지사항
                전달, 문의사항 또는 불만 처리, 회원 관리 등
              </p>
            </div>

            <div>
              <h4 className="mb-2 font-medium text-talearnt_Text_01">
                3. 마케팅 및 광고 활용
              </h4>
              <p>
                신규 서비스 개발 및 맞춤형 서비스 제공, 이벤트 및 프로모션 참여
                기회 제공, 접속 빈도 파악 또는 회원의 서비스 이용에 대한 통계 등
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 제2조 개인정보의 수집 항목 및 방법 */}
      <section>
        <h2 className="mb-4 border-b-2 border-talearnt_Primary_01 pb-2 text-body1_18_semibold text-talearnt_Text_01">
          제2조 (개인정보의 수집 항목 및 방법)
        </h2>

        <div className="space-y-4 text-body3_14_medium text-talearnt_Text_02">
          <p>
            회사는 다음과 같이 개인정보를 수집 및 이용합니다.{" "}
            <strong>필수 항목</strong>은 서비스 제공을 위해 반드시 필요한
            정보이며, <strong>선택 항목</strong>은 더 나은 서비스 제공을 위해
            추가로 수집하는 정보입니다. 이용자는 선택 항목의 수집에 동의하지
            않아도 서비스 이용에 제한을 받지 않습니다.
          </p>

          <div>
            <h4 className="mb-2 font-medium text-talearnt_Text_01">
              1. 회원가입 시 수집 항목
            </h4>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                <strong>필수 항목</strong>: 이메일 주소, 비밀번호, 닉네임, 이름,
                성별, 휴대폰 번호
              </li>
              <li>
                <strong>선택 항목</strong>: 프로필 이미지, 관심사, 직업 등
              </li>
              <li>
                <strong>소셜 로그인 시</strong>: 소셜 계정의 고유 식별 정보
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-talearnt_Text_01">
              2. 서비스 이용 과정에서 자동 수집 항목
            </h4>
            <p>
              서비스 이용 기록, 접속 일시, IP Address, 기기 정보(OS, UDID),
              쿠키, 불량 이용 기록
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-talearnt_Text_01">
              3. 고객 문의 시 수집 항목
            </h4>
            <p>문의 내용에 포함된 정보(이메일 주소, 이름, 휴대폰 번호 등)</p>
          </div>
        </div>
      </section>

      {/* 제3조 개인정보의 제3자 제공 */}
      <section>
        <h2 className="mb-4 border-b-2 border-talearnt_Primary_01 pb-2 text-body1_18_semibold text-talearnt_Text_01">
          제3조 (개인정보의 제3자 제공)
        </h2>

        <div className="space-y-3 text-body3_14_medium text-talearnt_Text_02">
          <p>
            회사는 이용자의 개인정보를{" "}
            <strong>원칙적으로 제3자에게 제공하지 않으며</strong>, 다음의
            경우에만 예외적으로 제공할 수 있습니다.
          </p>

          <ol className="ml-6 list-decimal space-y-1">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법률에 특별한 규정이 있는 경우</li>
            <li>
              수사 목적으로 법령에 따른 적법한 절차와 방법에 따라 수사기관의
              요청이 있는 경우
            </li>
          </ol>
        </div>
      </section>

      {/* 제4조 개인정보 처리 위탁 및 국외 이전 */}
      <section>
        <h2 className="mb-4 border-b-2 border-talearnt_Primary_01 pb-2 text-body1_18_semibold text-talearnt_Text_01">
          제4조 (개인정보 처리 위탁 및 국외 이전)
        </h2>

        <div className="space-y-4 text-body3_14_medium text-talearnt_Text_02">
          <p>
            회사는 원활한 개인정보 업무처리를 위해 개인정보 처리 업무를 위탁하고
            있습니다. 위탁 계약 시 개인정보보호 관련 법규의 준수, 개인정보에
            관한 비밀유지, 제3자 제공 금지 및 사고 발생 시 책임 부담 등을 명확히
            규정하고, 해당 계약 내용을 서면 또는 전자적으로 보관하고 있습니다.
          </p>

          <div>
            <h4 className="mb-2 font-medium text-talearnt_Text_01">
              개인정보 처리 위탁
            </h4>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                <strong>수탁업체</strong>: 솔라피㈜
              </li>
              <li>
                <strong>위탁업무 내용</strong>: 본인 인증 번호 문자 메세지 발송
              </li>
              <li>
                <strong>수탁업체</strong>: 카카오㈜
              </li>
              <li>
                <strong>위탁업무 내용</strong>: 카카오 계정을 통한 로그인 및
                인증 서비스 제공
              </li>
              <li>
                <strong>수탁업체</strong>: 한국마이크로소프트㈜
              </li>
              <li>
                <strong>위탁업무 내용</strong>: 데이터베이스 인프라 운영, 관리
              </li>
              <li>
                <strong>수탁업체</strong>: 아마존웹서비스코리아㈜
              </li>
              <li>
                <strong>위탁업무 내용</strong>: 클라우드 서버 인프라 운영 및
                관리
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-talearnt_Text_01">
              개인정보 국외 이전
            </h4>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                <strong>이전되는 국가</strong>: 미국
              </li>
              <li>
                <strong>이전받는 자</strong>: Google LLC
              </li>
              <li>
                <strong>이전 목적</strong>: 이메일 발송 서비스 제공
              </li>
              <li>
                <strong>이전 항목</strong>: 회원 이메일 주소, 발송 내용
              </li>
              <li>
                <strong>보유 및 이용 기간</strong>: 회원 탈퇴 시까지
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 제5조 개인정보의 파기 */}
      <section>
        <h2 className="mb-4 border-b-2 border-talearnt_Primary_01 pb-2 text-body1_18_semibold text-talearnt_Text_01">
          제5조 (개인정보의 파기)
        </h2>

        <div className="space-y-4 text-body3_14_medium text-talearnt_Text_02">
          <p>
            회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체
            없이 파기합니다. 단, 관계 법령에 따라 보존해야 하는 정보는 법령이
            정한 기간 동안 보관 후 파기합니다.
          </p>

          <div>
            <h4 className="mb-2 font-medium text-talearnt_Text_01">
              1. 파기 절차 및 방법
            </h4>
            <p>
              파기 사유가 발생한 개인정보를 선정하고, 개인정보 보호 책임자의
              승인을 받아 파기합니다. 전자적 파일 형태의 정보는 기록을 재생할 수
              없는 기술적 방법을 사용하여 파기하며, 종이 문서에 기록된
              개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-talearnt_Text_01">
              2. 법령 및 내부 방침에 따른 보존
            </h4>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                <strong>개인 식별 정보(이름, 닉네임, 프로필 사진 등)</strong>:
                회원 탈퇴 7일 후 파기
              </li>
              <li>
                <strong>서비스 이용 기록(IP 주소, 접속 기록 등)</strong>:
                「통신비밀보호법」에 따라 3개월 보존
              </li>
              <li>
                <strong>부정 이용 기록</strong>: 부정 이용 방지 및 서비스 운영의
                일관성 유지를 위해, 부정 이용자 기록은 해당 이용자가 서비스 이용
                제한 조치를 받은 날로부터 서비스 운영 종료까지 보관될 수
                있습니다.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 제6조 이용자의 권리와 그 행사 방법 */}
      <section>
        <h2 className="mb-4 border-b-2 border-talearnt_Primary_01 pb-2 text-body1_18_semibold text-talearnt_Text_01">
          제6조 (이용자의 권리와 그 행사 방법)
        </h2>

        <div className="space-y-3 text-body3_14_medium text-talearnt_Text_02">
          <p>
            이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할
            수 있으며, 회원 탈퇴를 요청할 수도 있습니다.
          </p>

          <div>
            <h4 className="mb-2 font-medium text-talearnt_Text_01">
              1. 개인정보 열람, 정정, 삭제, 처리 정지 요청
            </h4>
            <p>
              서비스 내 '마이페이지' 메뉴를 통해 직접 가능하며, 어려운 경우
              서면, 전화, 이메일 등을 통해 회사에 요청할 수 있습니다.
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-talearnt_Text_01">
              2. 대리인을 통한 권리 행사
            </h4>
            <p>
              이용자의 법정대리인이나 위임을 받은 자가 권리를 행사할 수 있으며,
              이 경우 「개인정보보호법 시행규칙」에 따른 위임장을 제출해야
              합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 제7조 개인정보 안전성 확보 조치 */}
      <section>
        <h2 className="mb-4 border-b-2 border-talearnt_Primary_01 pb-2 text-body1_18_semibold text-talearnt_Text_01">
          제7조 (개인정보 안전성 확보 조치)
        </h2>

        <div className="space-y-3 text-body3_14_medium text-talearnt_Text_02">
          <p>
            회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고
            있습니다.
          </p>

          <div>
            <h4 className="mb-2 font-medium text-talearnt_Text_01">
              1. 관리적 조치
            </h4>
            <p>
              개인정보 처리 최소화, 정기적인 임직원 교육, 내부 관리계획 수립 및
              시행 등
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-talearnt_Text_01">
              2. 기술적 조치
            </h4>
            <p>
              개인정보 암호화, 접근 통제 시스템 구축, 보안 프로그램 설치 및
              갱신, 백업 시스템 운영 등
            </p>
          </div>
        </div>
      </section>

      {/* 제8조 쿠키 및 유사 기술의 사용 */}
      <section>
        <h2 className="mb-4 border-b-2 border-talearnt_Primary_01 pb-2 text-body1_18_semibold text-talearnt_Text_01">
          제8조 (쿠키 및 유사 기술의 사용)
        </h2>

        <div className="text-body3_14_medium text-talearnt_Text_02">
          <p>
            회사는 이용자에게 맞춤형 서비스를 제공하기 위해 쿠키(Cookie)를
            사용합니다. 이용자는 웹 브라우저의 옵션을 설정하여 모든 쿠키를
            허용하거나, 거부할 수 있습니다. 단, 쿠키 저장을 거부할 경우 일부
            서비스 이용에 어려움이 있을 수 있습니다.
          </p>
        </div>
      </section>

      {/* 제9조 개인정보 보호 책임자 및 고충처리 부서 */}
      <section>
        <h2 className="mb-4 border-b-2 border-talearnt_Primary_01 pb-2 text-body1_18_semibold text-talearnt_Text_01">
          제9조 (개인정보 보호 책임자 및 고충처리 부서)
        </h2>

        <div className="space-y-4 text-body3_14_medium text-talearnt_Text_02">
          <p>
            회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
            처리와 관련한 이용자의 불만 처리 및 피해 구제 등을 위해 아래와 같이
            개인정보 보호 책임자를 지정하고 있습니다.
          </p>

          <div>
            <h4 className="mb-2 font-medium text-talearnt_Text_01">
              개인정보 보호 책임자
            </h4>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                <strong>성명</strong>: 정운만
              </li>
              <li>
                <strong>소속/직위</strong>: 대표
              </li>
              <li>
                <strong>연락처</strong>: 010-2908-9421
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-talearnt_Text_01">
              고충처리 담당 부서
            </h4>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                <strong>부서명</strong>: Talearnt
              </li>
              <li>
                <strong>연락처</strong>: 010-2908-9421
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 제10조 권익침해 구제 방법 */}
      <section>
        <h2 className="mb-4 border-b-2 border-talearnt_Primary_01 pb-2 text-body1_18_semibold text-talearnt_Text_01">
          제10조 (권익침해 구제 방법)
        </h2>

        <div className="space-y-3 text-body3_14_medium text-talearnt_Text_02">
          <p>
            이용자는 개인정보 침해에 대한 피해 구제, 상담 등을 아래 기관에
            문의할 수 있습니다.
          </p>

          <ol className="ml-6 list-decimal space-y-1">
            <li>
              <strong>개인정보 침해신고센터</strong>: (국번없이) 118
              (privacy.kisa.or.kr)
            </li>
            <li>
              <strong>개인정보 분쟁조정위원회</strong>: (국번없이) 1833-6972
              (kopico.go.kr)
            </li>
            <li>
              <strong>대검찰청 사이버수사과</strong>: (국번없이) 1301
              (spo.go.kr)
            </li>
            <li>
              <strong>경찰청 사이버안전국</strong>: (국번없이) 182
              (cyberbureau.police.go.kr)
            </li>
          </ol>
        </div>
      </section>

      {/* 제11조 개인정보 처리방침 변경 */}
      <section>
        <h2 className="mb-4 border-b-2 border-talearnt_Primary_01 pb-2 text-body1_18_semibold text-talearnt_Text_01">
          제11조 (개인정보 처리방침 변경)
        </h2>

        <div className="text-body3_14_medium text-talearnt_Text_02">
          <p>
            이 방침은 법령 및 회사 정책의 변경에 따라 변경될 수 있으며, 변경 시
            최소 7일 전 홈페이지를 통해 공지합니다. 단, 중요한 변경 사항이
            발생할 경우 최소 30일 전에 공지합니다.
          </p>
        </div>
      </section>

      {/* 부칙 */}
      <section>
        <h2 className="mb-4 border-b-2 border-talearnt_Primary_01 pb-2 text-body1_18_semibold text-talearnt_Text_01">
          부칙
        </h2>

        <div className="text-body3_14_medium text-talearnt_Text_02">
          <p>본 방침은 2025.09.01부터 적용됩니다.</p>
        </div>
      </section>
    </div>
  );
}

export { PrivacyPolicy };
