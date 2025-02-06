import { classNames } from "@utils/classNames";

import { TextEditor } from "@components/TextEditor/TextEditor";

function WriteArticle() {
  return (
    <div className={classNames("w-[848px]")}>
      <TextEditor />
    </div>
  );
}

export default WriteArticle;
