import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { AuthLayout } from "@layout/auth/AuthLayout";

import { TabSlider } from "@components/common/TabSlider/TabSlider";

const options = [
  {
    label: "아이디 찾기",
    value: "id",
  },
  {
    label: "비밀번호 찾기",
    value: "pw",
  },
];

function FindAccountLayout() {
  const navigator = useNavigate();
  const { pathname } = useLocation();

  const pathArray = pathname.split("/");
  const currentPage = pathArray[pathArray.length - 1];

  return (
    <AuthLayout>
      <TabSlider
        className={"h-[50px]"}
        currentValue={currentPage === "change" ? "pw" : currentPage}
        onClickHandler={value => navigator(`/find-account/${value}`)}
        options={options}
      />
      <Outlet />
    </AuthLayout>
  );
}

export default FindAccountLayout;
