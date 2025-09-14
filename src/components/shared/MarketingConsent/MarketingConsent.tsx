function MarketingConsent() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-4 border-b-2 border-talearnt_Primary_01 pb-2 text-body1_18_semibold text-talearnt_Text_01">
          마케팅 목적의 개인정보 수집 및 이용 동의
        </h2>

        <div className="space-y-4 text-body3_14_medium text-talearnt_Text_02">
          <p>
            마케팅 정보 수신에 동의하시면, Talearnt의 다양한 서비스 및 이벤트
            정보를 받아보실 수 있습니다.
          </p>

          <div>
            <h4 className="mb-2 font-medium text-talearnt_Text_01">
              1. 수집하는 개인정보 항목
            </h4>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                <strong>필수</strong>: 이메일, 전화번호, 성별
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-talearnt_Text_01">
              2. 수집 및 이용 목적
            </h4>
            <ul className="ml-6 list-disc space-y-1">
              <li>신규 서비스 및 이벤트 소식</li>
              <li>
                성별, 관심사, 이용 기록 등을 기반으로 한 맞춤형 광고 및 프로모션
                제공
              </li>
              <li>(키워드, 성별 등) 정보에 기반하여 적합한 매칭 대상 안내</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-talearnt_Text_01">
              3. 개인정보의 보유 및 이용 기간
            </h4>
            <p>
              <strong>동의 철회 또는 회원 탈퇴 시까지</strong> 보유 및
              이용됩니다.
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-talearnt_Text_01">
              4. 동의 거부 권리 및 불이익 안내
            </h4>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                이용자는 마케팅 목적의 개인정보 수집 및 이용에{" "}
                <strong>동의를 거부할 권리가 있습니다.</strong>
              </li>
              <li>
                다만, 동의하지 않으실 경우, 맞춤형 서비스와 이벤트 정보 제공이
                제한될 수 있습니다.
              </li>
              <li>
                동의 이후 철회를 원하시는 경우 '내 프로필 &gt; 계정관리'에서
                철회가 가능합니다.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export { MarketingConsent };
