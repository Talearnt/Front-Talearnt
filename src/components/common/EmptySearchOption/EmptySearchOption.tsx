import { MakoExpressionSad } from "@components/common/icons/mako/MakoExpressionSad";

function EmptySearchOption({ search }: { search: string }) {
  return (
    <>
      <p className="w-full text-center text-heading4_20_semibold text-talearnt_Text_03">
        <span className="inline-block max-w-[calc(100%-25px)] overflow-hidden text-ellipsis whitespace-nowrap align-sub">
          '{search}
        </span>
        '에
        <br />
        대한 검색 결과가 없어요...
      </p>
      <MakoExpressionSad />
    </>
  );
}

export { EmptySearchOption };
