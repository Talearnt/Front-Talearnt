import { useParams } from "react-router-dom";

import { classNames } from "@shared/utils/classNames";

import { agreementsDataMap } from "@components/common/modal/AgreementsModal/AgreementsModal";

import { agreementIdType } from "@features/auth/signUp/signUp.type";

function AgreementsDetail() {
  const { agreementsType } = useParams();

  if (!agreementsType) {
    return null;
  }

  const { title, content } =
    agreementsDataMap[agreementsType as agreementIdType];

  return (
    <div className={classNames("flex flex-col gap-14", "w-[848px]")}>
      <span className="text-center text-heading1_30_semibold text-talearnt_Text_Strong">
        {title}
      </span>
      {content}
    </div>
  );
}

export default AgreementsDetail;
