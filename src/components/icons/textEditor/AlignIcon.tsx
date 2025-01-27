type AlignIconProps = {
  align: "" | "center" | "right";
};

function AlignIcon({ align }: AlignIconProps) {
  switch (align) {
    case "":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className={"ql-stroke"}
            d="M2.89961 3.60156L22.0996 3.60156M2.89961 8.80156L17.0237 8.80156M2.89961 14.0016L22.0996 14.0016M2.89961 19.2016L13.1617 19.2016"
          />
        </svg>
      );
    case "center":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className={"ql-stroke"}
            d="M22.1004 19.7969H2.90039M20.3004 14.5969H6.17625M22.1004 9.39687H2.90039M17.9004 4.79688L7.63832 4.79687"
          />
        </svg>
      );
    case "right":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className={"ql-stroke"}
            d="M22.1004 19.2016H2.90039M22.1004 14.0016H7.97625M22.1004 8.80156H2.90039M22.1004 3.60156L11.8383 3.60156"
          />
        </svg>
      );
  }
}

export { AlignIcon };
