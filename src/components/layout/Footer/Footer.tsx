import { Link } from "react-router-dom";

import { classNames } from "@shared/utils/classNames";

import { LogoIcon } from "@components/common/icons/LogoIcon/LogoIcon";

function Footer() {
  return (
    <footer
      className={classNames(
        "flex flex-col gap-8",
        "mt-[120px] w-[1440px] bg-talearnt_BG_Up_01 px-20 py-8"
      )}
    >
      <div className={"flex justify-between"}>
        <LogoIcon />
        <div className={"flex gap-14"}>
          <div className={"flex flex-col gap-4"}>
            <div className={"flex flex-col gap-1"}>
              <span className="text-caption2_12_semibold text-talearnt_Text_03">
                개인정보보호책임자 성명
              </span>
              <span className="text-caption1_14_medium text-talearnt_Text_02">
                정운만
              </span>
            </div>
            <div className={"flex flex-col gap-1"}>
              <span className="text-caption2_12_semibold text-talearnt_Text_03">
                개인정보보호책임자 연락처
              </span>
              <span className="text-caption1_14_medium text-talearnt_Text_02">
                010-0000-0000
              </span>
            </div>
          </div>
          <div className={"flex flex-col gap-4"}>
            <div className={"flex flex-col gap-1"}>
              <span className="text-caption2_12_semibold text-talearnt_Text_03">
                회사명
              </span>
              <span className="text-caption1_14_medium text-talearnt_Text_02">
                (주)탤런트
              </span>
            </div>
            <div className={"flex flex-col gap-1"}>
              <span className="text-caption2_12_semibold text-talearnt_Text_03">
                대표 이사
              </span>
              <span className="text-caption1_14_medium text-talearnt_Text_02">
                정운만
              </span>
            </div>
          </div>
          <div className={"flex flex-col gap-4"}>
            <div className={"flex flex-col gap-1"}>
              <span className="text-caption2_12_semibold text-talearnt_Text_03">
                대표 전화번호
              </span>
              <span className="text-caption1_14_medium text-talearnt_Text_02">
                02-0000-0000
              </span>
            </div>
            <div className={"flex flex-col gap-1"}>
              <span className="text-caption2_12_semibold text-talearnt_Text_03">
                대표 이메일
              </span>
              <span className="text-caption1_14_medium text-talearnt_Text_02">
                talearnt@gmail.com
              </span>
            </div>
          </div>
          <div className={"flex flex-col gap-4"}>
            <div className={"flex flex-col gap-1"}>
              <span className="text-caption2_12_semibold text-talearnt_Text_03">
                사업자등록번호
              </span>
              <span className="text-caption1_14_medium text-talearnt_Text_02">
                000-00-00000
              </span>
            </div>
            <div className={"flex flex-col gap-1"}>
              <span className="text-caption2_12_semibold text-talearnt_Text_03">
                주소
              </span>
              <span className="text-caption1_14_medium text-talearnt_Text_02">
                서울특별시 강남구 어쩌구 저쩌구 OO로 00-00
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[1px] w-full bg-talearnt_Line_01" />
      <div className={"flex items-end justify-between"}>
        <div className={"flex flex-col"}>
          <span
            className={classNames(
              "mb-2",
              "text-caption1_14_medium text-talearnt_Text_03"
            )}
          >
            Copyright © Talearnt. All Rights Reserved.
          </span>
          <span className="text-caption1_14_medium text-talearnt_Text_03">
            Icons by FREE Icons for Figma (CC BY 4.0)
          </span>
          <a
            className="text-caption1_14_medium text-talearnt_Text_03 underline"
            href="https://www.figma.com/community/file/1177180791780461401"
          >
            https://www.figma.com/community/file/1177180791780461401
          </a>
        </div>
        <div className={"flex items-center gap-2"}>
          <Link
            className={classNames(
              "px-3 py-[11px]",
              "text-body3_14_medium text-talearnt_Text_02"
            )}
            to={"/event-notice/event"}
          >
            이벤트
          </Link>
          <div className={"h-6 w-[1px] bg-talearnt_Line_01"} />
          <Link
            className={classNames(
              "px-3 py-[11px]",
              "text-body3_14_medium text-talearnt_Text_02"
            )}
            to={"/event-notice/notice"}
          >
            공지사항
          </Link>
          <div className={"h-6 w-[1px] bg-talearnt_Line_01"} />
          <Link
            className={classNames(
              "px-3 py-[11px]",
              "text-body3_14_medium text-talearnt_Text_02"
            )}
            to={"/agreements/terms"}
          >
            이용약관
          </Link>
          <div className={"h-6 w-[1px] bg-talearnt_Line_01"} />
          <Link
            className={classNames(
              "px-3 py-[11px]",
              "text-body3_14_medium text-talearnt_Text_02"
            )}
            to={"/agreements/privacy"}
          >
            개인정보처리방침
          </Link>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
