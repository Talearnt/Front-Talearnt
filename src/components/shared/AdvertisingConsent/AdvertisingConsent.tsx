function AdvertisingConsent() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-4 border-b-2 border-talearnt_Primary_01 pb-2 text-body1_18_semibold text-talearnt_Text_01">
          광고성 정보 수신 동의
        </h2>

        <div className="space-y-4 text-body3_14_medium text-talearnt_Text_02">
          <div>
            <h4 className="mb-2 font-medium text-talearnt_Text_01">
              수집하는 개인정보 항목
            </h4>
            <p>이메일, 전화번호</p>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-talearnt_Text_01">
              광고성 정보의 발송 목적
            </h4>
            <ul className="ml-6 list-disc space-y-1">
              <li>Talearnt 프로모션 안내</li>
              <li>서비스 내 알림 안내</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-talearnt_Text_01">
              광고성 정보 수신 동의 철회
            </h4>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                이용자는 언제든지 광고성 정보 수신 동의를 철회할 수 있으며, 철회
                시 관련 정보 발송이 중단됩니다.
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

export { AdvertisingConsent };
