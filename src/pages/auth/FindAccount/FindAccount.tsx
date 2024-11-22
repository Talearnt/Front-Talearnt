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

  return (
    <div className={classNames("flex flex-col gap-14", "w-[39.5rem]")}>
      <TabSlider
        className={"text-lg"}
        currentValue={pathArray[pathArray.length - 1]}
        onClickHandler={value => navigator(`/find-account/${value}`)}
        options={options}
      />
      <Outlet />
    </div>
  );
}

export default FindAccount;
