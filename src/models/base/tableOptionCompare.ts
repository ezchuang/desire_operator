export default function parseFieldFlags(flags: number) {
  return {
    isNotNull: !!(flags & 1), // NOT_NULL_FLAG
    isPrimaryKey: !!(flags & 2), // PRI_KEY_FLAG
    isUniqueKey: !!(flags & 4), // UNIQUE_KEY_FLAG
    isMultipleKey: !!(flags & 8), // MULTIPLE_KEY_FLAG
    isBlob: !!(flags & 16), // BLOB_FLAG
    isUnsigned: !!(flags & 32), // UNSIGNED_FLAG
    isZerofill: !!(flags & 64), // ZEROFILL_FLAG
    isBinary: !!(flags & 128), // BINARY_FLAG
    isEnum: !!(flags & 256), // ENUM_FLAG
    isAutoIncrement: !!(flags & 512), // AUTO_INCREMENT_FLAG
    isTimestamp: !!(flags & 1024), // TIMESTAMP_FLAG
    isSet: !!(flags & 2048), // SET_FLAG
  };
}

// 測試OK
