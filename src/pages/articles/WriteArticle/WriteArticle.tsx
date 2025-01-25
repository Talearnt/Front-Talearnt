import { useState } from "react";
import ReactQuill from "react-quill-new";

import "react-quill-new/dist/quill.snow.css";

function WriteArticle() {
  const [value, setValue] = useState("");

  return <ReactQuill theme="snow" value={value} onChange={setValue} />;
}

export { WriteArticle };
