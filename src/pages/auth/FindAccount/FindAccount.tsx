import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { classNames } from "@utils/classNames";

import { TabSlider } from "@components/TabSlider/TabSlider";

const options = [
  {
    label: "아이디",
    value: "id"
  },
  {
    label: "패스워드",
    value: "pw"
  }
];

function FindAccount() {
  const navigator = useNavigate();
  const { pathname } = useLocation();

  const pathArray = pathname.split("/");
  const currentPage = pathArray[pathArray.length - 1];

  return (
    <div className={classNames("flex flex-col gap-[56px]", "w-[632px]")}>
      <TabSlider
        className={"text-lg"}
        currentValue={currentPage}
        onClickHandler={value => navigator(`/find-account/${value}`)}
        options={options}
      />
      <p className={classNames("text-center text-3xl font-semibold")}>
        {currentPage === "id" && (
          <>
            가입 시 등록한 휴대폰 정보로
            <br />
            아이디를 찾을 수 있어요
          </>
        )}
        {currentPage === "pw" && (
          <>
            본인 확인을 통해
            <br />
            비밀번호를 재설정할 수 있어요
          </>
        )}
      </p>
      <Outlet />
    </div>
  );
}

export default FindAccount;
