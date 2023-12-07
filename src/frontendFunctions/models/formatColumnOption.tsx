// 將 column 的 屬性 轉換成 字串
const formatColumnOption = (key: string, value: string) => {
  switch (key) {
    case "isNotNull":
      return value ? "Not Null" : "Nullable";
    case "isPrimaryKey":
      return value ? "Primary Key" : "";
    case "isUniqueKey":
      return value ? "Unique Key" : "";
    case "isMultipleKey":
      return value ? "Multiple Key" : "";
    case "isBlob":
      return value ? "Blob" : "";
    case "isUnsigned":
      return value ? "Unsigned" : "";
    case "isZerofill":
      return value ? "Zerofill" : "";
    case "isBinary":
      return value ? "Binary" : "";
    case "isEnum":
      return value ? "Enum" : "";
    case "isAutoIncrement":
      return value ? "Auto Increment" : "";
    case "isTimestamp":
      return value ? "Timestamp" : "";
    case "isSet":
      return value ? "Set" : "";
    default:
      return `${key}: ${value}`;
  }
};

export default formatColumnOption;
