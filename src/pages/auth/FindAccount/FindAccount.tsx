import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { classNames } from "@utils/classNames";

import { TabSlider } from "@components/TabSlider/TabSlider";

const options = [
  {
    label: "아이디 찾기",
    value: "id"
  },
  {
    label: "비밀번호 찾기",
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
        currentValue={currentPage === "change" ? "pw" : currentPage}
        onChangeHandler={value => navigator(`/find-account/${value}`)}
        onClickHandler={
          currentPage === "change"
            ? value => navigator(`/find-account/${value}`)
            : undefined
        }
        options={options}
      />
      <Outlet />
    </div>
  );
}

export default FindAccount;
