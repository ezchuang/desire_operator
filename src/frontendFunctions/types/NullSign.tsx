import React from "react";

const NullSign: React.FC = () => (
  <img
    className="h-5 min-h-[16px] aspect-auto"
    src="https://d2ndnbzl6dhb4z.cloudfront.net/null2.svg"
    alt="空值"
    onError={(event) => (event.currentTarget.src = "空值圖片的URL")}
  />
);

export default NullSign;
