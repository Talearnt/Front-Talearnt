import { ComponentProps } from "react";

import { classNames } from "@utils/classNames";

/**
 * 로고 아이콘
 *
 * @param {string | undefined} className
 * @param {Omit<React.ComponentProps<"svg">, "className">} props
 * @returns {JSX.Element}
 * @constructor
 */
function LogoIcon({ className, ...props }: ComponentProps<"svg">) {
  return (
    <svg
      width="170"
      height="34"
      viewBox="0 0 170 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(className)}
      {...props}
    >
      <g clipPath="url(#clip0_190_1381)">
        <path
          d="M46.3308 30.5437L44.7816 19.5246C44.2579 14.3242 39.8721 10.2656 34.5334 10.2656C28.8457 10.2656 24.2344 14.8769 24.2344 20.5647V23.1395C24.2344 28.8272 28.8457 33.4385 34.5334 33.4385C37.0718 33.4385 39.3993 32.5148 41.1958 30.9947L41.2322 31.2565C41.4286 32.6675 42.7305 33.6494 44.1415 33.4458C45.5526 33.2494 46.5345 31.9475 46.3308 30.5364V30.5437ZM39.683 20.572V23.1467C39.683 25.9906 37.3773 28.2963 34.5334 28.2963C31.6896 28.2963 29.3839 25.9906 29.3839 23.1467V20.572C29.3839 17.7281 31.6896 15.4224 34.5334 15.4224C37.1155 15.4224 39.2538 17.328 39.6175 19.8083C39.6175 19.8083 39.6175 19.8228 39.6175 19.8301L39.6539 20.0919C39.6684 20.2519 39.6757 20.4119 39.6757 20.572H39.683Z"
          fill="#1B76FF"
        />
        <path
          d="M105.089 30.5437L103.539 19.5246C103.016 14.3242 98.6299 10.2656 93.2912 10.2656C87.6035 10.2656 82.9922 14.8769 82.9922 20.5647V23.1395C82.9922 28.8272 87.6035 33.4385 93.2912 33.4385C95.8296 33.4385 98.1571 32.5148 99.9536 30.9947L99.99 31.2565C100.186 32.6675 101.488 33.6494 102.899 33.4458C104.31 33.2494 105.292 31.9475 105.089 30.5364V30.5437ZM98.4481 20.572V23.1467C98.4481 25.9906 96.1424 28.2963 93.2985 28.2963C90.4546 28.2963 88.149 25.9906 88.149 23.1467V20.572C88.149 17.7281 90.4546 15.4224 93.2985 15.4224C95.8806 15.4224 98.0189 17.328 98.3826 19.8083C98.3826 19.8083 98.3826 19.8228 98.3826 19.8301L98.419 20.0919C98.4335 20.2519 98.4408 20.4119 98.4408 20.572H98.4481Z"
          fill="#1B76FF"
        />
        <path
          d="M18.0234 18.0267C16.5978 18.0267 15.4486 19.1832 15.4486 20.6015V23.1763C15.4486 26.0201 13.1429 28.3258 10.2991 28.3258C7.45518 28.3258 5.14953 26.0201 5.14953 23.1763V15.452H12.8738C14.2994 15.452 15.4486 14.2955 15.4486 12.8772C15.4486 11.4516 14.2921 10.3024 12.8738 10.3024H5.14953V5.15289C5.14953 3.72731 3.99307 2.57813 2.57477 2.57813C1.15646 2.57812 0 3.73459 0 5.15289V22.9726C0 28.7476 4.72768 33.5844 10.5027 33.4753C16.2778 33.3662 20.5981 28.7986 20.5981 23.1763V20.6015C20.5981 19.1759 19.4417 18.0267 18.0234 18.0267Z"
          fill="#1B76FF"
        />
        <path
          d="M167.422 18.0267C165.996 18.0267 164.847 19.1832 164.847 20.6015V23.1763C164.847 26.0201 162.541 28.3258 159.698 28.3258C156.854 28.3258 154.548 26.0201 154.548 23.1763V15.452H162.272C163.698 15.452 164.847 14.2955 164.847 12.8772C164.847 11.4516 163.691 10.3024 162.272 10.3024H154.548V5.15289C154.548 3.72731 153.392 2.57812 151.973 2.57812C150.548 2.57812 149.398 3.73459 149.398 5.15289V22.9726C149.398 28.7476 154.126 33.5844 159.901 33.4753C165.676 33.3662 169.997 28.7986 169.997 23.1763V20.6015C169.997 19.1759 168.84 18.0267 167.422 18.0267Z"
          fill="#1B76FF"
        />
        <path
          d="M55.1417 2.57477C55.1417 1.15276 53.989 0 52.5669 0C51.1449 0 49.9922 1.15276 49.9922 2.57477V30.8972C49.9922 32.3192 51.1449 33.472 52.5669 33.472C53.989 33.472 55.1417 32.3192 55.1417 30.8972V2.57477Z"
          fill="#1B76FF"
        />
        <path
          d="M79.3565 20.1814C79.1383 14.6827 74.6143 10.2969 69.0647 10.2969C63.5151 10.2969 58.7656 14.9082 58.7656 20.5959V23.1707C58.7656 28.8585 63.3769 33.4698 69.0647 33.4698C72.3741 33.4698 75.3198 31.906 77.2036 29.484C78.5128 27.7966 77.2981 25.3309 75.1598 25.3309C74.3597 25.3309 73.6105 25.7164 73.1159 26.3419C72.1777 27.542 70.7157 28.313 69.072 28.313C66.3808 28.313 64.1697 26.2473 63.9442 23.6071H75.9307C77.8291 23.6071 79.3638 22.0724 79.3638 20.1741L79.3565 20.1814ZM63.937 20.1814C64.1479 17.5339 66.359 15.4464 69.0647 15.4464C71.7704 15.4464 73.9815 17.5339 74.1924 20.1814H63.937Z"
          fill="#1B76FF"
        />
        <path
          d="M118.409 12.8935C116.78 12.9953 115.245 13.4826 113.9 14.2609V12.8716C113.9 11.4461 112.743 10.2969 111.325 10.2969C109.899 10.2969 108.75 11.4461 108.75 12.8716V30.895C108.75 32.3206 109.899 33.4698 111.325 33.4698C112.75 33.4698 113.9 32.3133 113.9 30.895V30.5095C113.9 30.5095 113.9 30.4441 113.9 30.415V23.3089C113.9 23.2653 113.9 23.2143 113.9 23.1707C113.9 20.3268 116.205 18.0212 119.049 18.0212C119.056 18.0212 119.071 18.0212 119.078 18.0212C120.475 18.0284 121.624 16.9447 121.624 15.5482V15.3446C121.624 13.9845 120.526 12.8862 119.173 12.8716C118.925 12.8716 118.671 12.8716 118.416 12.8935H118.409Z"
          fill="#1B76FF"
        />
        <path
          d="M145.856 20.5999C145.856 14.8176 141.085 10.1408 135.266 10.3009C130.007 10.4463 125.629 14.6431 125.28 19.8944C125.265 20.1344 125.258 20.3672 125.258 20.6072V30.899C125.258 32.3246 126.414 33.4738 127.833 33.4738C129.258 33.4738 130.407 32.3246 130.407 30.899V20.6072C130.407 17.7633 132.713 15.4577 135.557 15.4577C138.401 15.4577 140.706 17.7633 140.706 20.6072V30.9063C140.706 32.3318 141.863 33.481 143.281 33.481C144.707 33.481 145.856 32.3318 145.856 30.9063V20.6145V20.5999Z"
          fill="#1B76FF"
        />
        <path
          d="M95.6483 16.0085C95.8956 15.6812 96.1211 15.3321 96.3175 14.9466C96.5429 14.5175 96.7175 14.0811 96.8484 13.6519C96.9139 13.4265 96.9139 13.1865 96.8484 12.9683C96.7175 12.4955 96.2229 12.2409 95.7574 12.4009C95.5392 12.4737 95.3501 12.6119 95.1974 12.7937C94.921 13.1501 94.6591 13.5428 94.4409 13.972C94.1791 14.4666 93.99 14.9757 93.8518 15.4703C93.67 15.4485 93.4809 15.4412 93.2917 15.4412C93.0008 15.4412 92.7099 15.4703 92.4262 15.5139C92.4189 15.5139 92.4117 15.5139 92.4044 15.5139C92.3244 15.5285 92.2444 15.543 92.1717 15.5576C92.1644 15.5576 92.1571 15.5576 92.1426 15.5576C92.2444 14.9175 92.2735 14.2265 92.208 13.5138C92.1571 12.9828 92.0625 12.4664 91.9244 11.9936C91.8516 11.7391 91.7062 11.5209 91.517 11.3536C91.1097 10.9972 90.4988 11.0481 90.1642 11.4772C90.0115 11.6736 89.9096 11.9209 89.8805 12.1755C89.8369 12.67 89.8296 13.1937 89.8805 13.7247C89.9678 14.6411 90.1933 15.4921 90.5206 16.2267C90.4842 16.2485 90.4479 16.2776 90.4115 16.2994C89.8005 16.714 89.2841 17.2523 88.8986 17.8778C88.8986 17.885 88.8914 17.8923 88.8841 17.9069C88.8623 17.9432 88.8405 17.9796 88.8186 18.016C88.7459 18.0232 88.6804 18.0305 88.6077 18.0305C88.4768 18.0305 88.3531 18.016 88.2368 17.9869C88.1931 17.9796 88.1495 17.9723 88.1058 17.9723C87.7931 17.9723 87.5312 18.2269 87.5312 18.5469C87.5312 18.6051 87.5385 18.656 87.5603 18.7069C87.8222 19.427 88.0258 20.1761 88.1568 20.9471V23.1291C88.1568 25.9657 90.4551 28.2714 93.299 28.2714C96.1429 28.2714 98.4413 25.973 98.4413 23.1291V20.5616C98.4413 18.5687 97.3066 16.8449 95.6483 15.994V16.0085Z"
          fill="white"
        />
        <path
          d="M91.0294 15.9662C91.2331 15.8644 91.4513 15.7771 91.6695 15.7044C91.7931 15.2607 91.8367 14.7516 91.7858 14.2134C91.7567 13.9224 91.7058 13.6533 91.6331 13.3915C91.5967 13.2533 91.5167 13.1369 91.4149 13.0496C91.1967 12.8533 90.8621 12.8896 90.6876 13.1151C90.6075 13.2242 90.5494 13.3551 90.5348 13.4933C90.513 13.7624 90.5057 14.0388 90.5348 14.3297C90.593 14.948 90.7676 15.5153 91.0294 15.9662Z"
          fill="#FFC2C2"
        />
        <path
          d="M95.2753 15.8463C95.4571 15.6135 95.6171 15.3517 95.7553 15.0607C95.8717 14.8135 95.959 14.5662 96.0244 14.3189C96.0608 14.1879 96.0535 14.057 96.0099 13.9334C95.9226 13.6715 95.6389 13.5333 95.3844 13.6352C95.268 13.6788 95.1589 13.7588 95.0789 13.8679C94.9334 14.0716 94.7952 14.297 94.6789 14.5443C94.5188 14.8789 94.4097 15.2208 94.3516 15.5481C94.6716 15.6135 94.9771 15.7153 95.268 15.839L95.2753 15.8463Z"
          fill="#FFC2C2"
        />
        <path
          d="M91.5393 19.4771C91.712 19.4771 91.8521 19.337 91.8521 19.1643C91.8521 18.9916 91.712 18.8516 91.5393 18.8516C91.3666 18.8516 91.2266 18.9916 91.2266 19.1643C91.2266 19.337 91.3666 19.4771 91.5393 19.4771Z"
          fill="#1B76FF"
        />
        <path
          d="M94.7424 19.4771C94.9152 19.4771 95.0552 19.337 95.0552 19.1643C95.0552 18.9916 94.9152 18.8516 94.7424 18.8516C94.5697 18.8516 94.4297 18.9916 94.4297 19.1643C94.4297 19.337 94.5697 19.4771 94.7424 19.4771Z"
          fill="#1B76FF"
        />
        <path
          d="M93.1337 19.6719H93.3083C93.4974 19.6719 93.6138 19.8683 93.5265 19.9846L93.4465 20.0865L93.4101 20.1228C93.2647 20.2901 93.0101 20.2901 92.8646 20.1228L92.8283 20.0865L92.7482 19.9846C92.661 19.8683 92.7773 19.6791 92.9664 19.6791H93.141L93.1337 19.6719Z"
          fill="#1B76FF"
        />
        <path
          d="M32.168 16.0085C31.9207 15.6812 31.6952 15.3321 31.4988 14.9466C31.2733 14.5175 31.0988 14.0811 30.9679 13.6519C30.9024 13.4265 30.9024 13.1865 30.9679 12.9683C31.0988 12.4955 31.5934 12.2409 32.0589 12.4009C32.2771 12.4737 32.4662 12.6119 32.6189 12.7937C32.8953 13.1501 33.1571 13.5428 33.3753 13.972C33.6372 14.4666 33.8263 14.9757 33.9645 15.4703C34.1463 15.4485 34.3354 15.4412 34.5245 15.4412C34.8155 15.4412 35.1064 15.4703 35.3901 15.5139C35.3973 15.5139 35.4046 15.5139 35.4119 15.5139C35.4919 15.5285 35.5719 15.543 35.6446 15.5576C35.6519 15.5576 35.6592 15.5576 35.6737 15.5576C35.5719 14.9175 35.5428 14.2265 35.6083 13.5138C35.6592 12.9828 35.7537 12.4664 35.8919 11.9936C35.9647 11.7391 36.1101 11.5209 36.2992 11.3536C36.7065 10.9972 37.3175 11.0481 37.6521 11.4772C37.8048 11.6736 37.9066 11.9209 37.9357 12.1755C37.9794 12.67 37.9866 13.1937 37.9357 13.7247C37.8485 14.6411 37.623 15.4921 37.2957 16.2267C37.332 16.2485 37.3684 16.2776 37.4048 16.2994C38.0157 16.714 38.5321 17.2523 38.9176 17.8778C38.9176 17.885 38.9249 17.8923 38.9322 17.9069C38.954 17.9432 38.9758 17.9796 38.9976 18.016C39.0704 18.0232 39.1358 18.0305 39.2086 18.0305C39.3395 18.0305 39.4631 18.016 39.5795 17.9869C39.6231 17.9796 39.6668 17.9723 39.7104 17.9723C40.0232 17.9723 40.285 18.2269 40.285 18.5469C40.285 18.6051 40.2778 18.656 40.2559 18.7069C39.9941 19.427 39.7904 20.1761 39.6595 20.9471V23.1291C39.6595 25.9657 37.3611 28.2714 34.5173 28.2714C31.6734 28.2714 29.375 25.973 29.375 23.1291V20.5616C29.375 18.5687 30.5096 16.8449 32.168 15.994V16.0085Z"
          fill="white"
        />
        <path
          d="M36.7929 15.9662C36.5893 15.8644 36.3711 15.7771 36.1529 15.7044C36.0292 15.2607 35.9856 14.7516 36.0365 14.2134C36.0656 13.9224 36.1165 13.6533 36.1892 13.3915C36.2256 13.2533 36.3056 13.1369 36.4074 13.0496C36.6256 12.8533 36.9602 12.8896 37.1348 13.1151C37.2148 13.2242 37.2729 13.3551 37.2875 13.4933C37.3093 13.7624 37.3166 14.0388 37.2875 14.3297C37.2293 14.948 37.0547 15.5153 36.7929 15.9662Z"
          fill="#FFC2C2"
        />
        <path
          d="M32.5381 15.8463C32.3562 15.6135 32.1962 15.3517 32.058 15.0607C31.9417 14.8135 31.8544 14.5662 31.7889 14.3189C31.7525 14.1879 31.7598 14.057 31.8035 13.9334C31.8907 13.6715 32.1744 13.5333 32.429 13.6352C32.5453 13.6788 32.6544 13.7588 32.7344 13.8679C32.8799 14.0716 33.0181 14.297 33.1345 14.5443C33.2945 14.8789 33.4036 15.2208 33.4618 15.5481C33.1418 15.6135 32.8363 15.7153 32.5453 15.839L32.5381 15.8463Z"
          fill="#FFC2C2"
        />
        <path
          d="M36.2893 19.4771C36.462 19.4771 36.6021 19.337 36.6021 19.1643C36.6021 18.9916 36.462 18.8516 36.2893 18.8516C36.1166 18.8516 35.9766 18.9916 35.9766 19.1643C35.9766 19.337 36.1166 19.4771 36.2893 19.4771Z"
          fill="#1B76FF"
        />
        <path
          d="M33.0784 19.4771C33.2511 19.4771 33.3911 19.337 33.3911 19.1643C33.3911 18.9916 33.2511 18.8516 33.0784 18.8516C32.9056 18.8516 32.7656 18.9916 32.7656 19.1643C32.7656 19.337 32.9056 19.4771 33.0784 19.4771Z"
          fill="#1B76FF"
        />
        <path
          d="M34.6879 19.6719H34.5133C34.3242 19.6719 34.2078 19.8683 34.2951 19.9846L34.3751 20.0865L34.4115 20.1228C34.557 20.2901 34.8115 20.2901 34.957 20.1228L34.9934 20.0865L35.0734 19.9846C35.1607 19.8683 35.0443 19.6791 34.8552 19.6791H34.6806L34.6879 19.6719Z"
          fill="#1B76FF"
        />
      </g>
      <defs>
        <clipPath id="clip0_190_1381">
          <rect width="170" height="33.472" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export { LogoIcon };