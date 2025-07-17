import { NavLink, Outlet } from "react-router-dom";

import { classNames } from "@shared/utils/classNames";

import { userSidebarArray } from "@features/user/user.constants";

function UserLayout() {
  return (
    <div className={classNames("grid grid-cols-[277px_1fr] gap-12", "pt-8")}>
      <div className={"flex flex-col gap-6"}>
        {userSidebarArray.map(({ category, items }) => (
          <div className={"flex flex-col gap-3"} key={category}>
            <div className={"px-4 py-2"}>
              <span
                className={"text-heading4_20_semibold text-talearnt_Text_01"}
              >
                {category}
              </span>
            </div>
            <div className={"flex flex-col gap-2"}>
              {items.map(({ path, content }) => (
                <NavLink
                  className={({ isActive }) =>
                    classNames(
                      "flex items-center gap-3",
                      "rounded-lg px-4 py-[15px]",
                      "hover:bg-talearnt_BG_Up_01",
                      isActive && "!bg-talearnt_PrimaryBG_01"
                    )
                  }
                  end
                  to={path}
                  key={path}
                >
                  {({ isActive }) => content({ isActive })}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Outlet />
    </div>
  );
}

export default UserLayout;
