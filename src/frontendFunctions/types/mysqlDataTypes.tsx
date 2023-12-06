export const MysqlDataTypes = {
  // 數字型別
  TINYINT: {
    needsLimit: false,
    displaySize: { min: 1, max: 4 },
    valueRange: { min: -128, max: 127 },
  },
  SMALLINT: {
    needsLimit: false,
    displaySize: { min: 1, max: 6 },
    valueRange: { min: -32768, max: 32767 },
  },
  MEDIUMINT: {
    needsLimit: false,
    displaySize: { min: 1, max: 9 },
    valueRange: { min: -8388608, max: 8388607 },
  },
  INT: {
    needsLimit: false,
    displaySize: { min: 1, max: 11 },
    valueRange: { min: -2147483648, max: 2147483647 },
  },
  BIGINT: {
    needsLimit: false,
    displaySize: { min: 1, max: 20 },
    valueRange: {
      min: BigInt("-9223372036854775808"),
      max: BigInt("9223372036854775807"),
    },
  },

  // 小數型別，M: 總數字長度, D: 小數點後的位數
  FLOAT: {
    needsLimit: true,
    displaySize: { min: 1, max: 12 },
    valueRange: null,
    precision: { M: 24, D: null },
  },
  DOUBLE: {
    needsLimit: true,
    displaySize: { min: 1, max: 22 },
    valueRange: null,
    precision: { M: 53, D: null },
  },
  DECIMAL: {
    needsLimit: true,
    displaySize: { min: 1, max: 65 },
    valueRange: null,
    precision: { M: 65, D: 30 },
  },

  // 字符串型別
  CHAR: {
    needsLimit: true,
    displaySize: { min: 0, max: 255 },
    valueRange: null,
  },
  VARCHAR: {
    needsLimit: true,
    displaySize: { min: 1, max: 65535 },
    valueRange: null,
  },
  BINARY: {
    needsLimit: true,
    displaySize: { min: 1, max: 255 },
    valueRange: null,
  },
  VARBINARY: {
    needsLimit: true,
    displaySize: { min: 1, max: 65535 },
    valueRange: null,
  },
  TINYTEXT: {
    needsLimit: false,
    displaySize: { min: null, max: 255 },
    valueRange: null,
  },
  TEXT: {
    needsLimit: false,
    displaySize: { min: null, max: 65535 },
    valueRange: null,
  },
  MEDIUMTEXT: {
    needsLimit: false,
    displaySize: { min: null, max: 16777215 },
    valueRange: null,
  },
  LONGTEXT: {
    needsLimit: false,
    displaySize: { min: null, max: 4294967295 },
    valueRange: null,
  },

  // 二進制型別（BLOB 類型）
  TINYBLOB: {
    needsLimit: false,
    displaySize: { min: null, max: 255 },
    valueRange: null,
  },
  BLOB: {
    needsLimit: false,
    displaySize: { min: null, max: 65535 },
    valueRange: null,
  },
  MEDIUMBLOB: {
    needsLimit: false,
    displaySize: { min: null, max: 16777215 },
    valueRange: null,
  },
  LONGBLOB: {
    needsLimit: false,
    displaySize: { min: null, max: 4294967295 },
    valueRange: null,
  },

  // 日期和時間型別
  DATE: {
    needsLimit: false,
    displaySize: { min: null, max: null },
    valueRange: null,
  },
  DATETIME: {
    needsLimit: false,
    displaySize: { min: null, max: null },
    valueRange: null,
  },
  TIMESTAMP: {
    needsLimit: false,
    displaySize: { min: null, max: null },
    valueRange: null,
  },
  TIME: {
    needsLimit: false,
    displaySize: { min: null, max: null },
    valueRange: null,
  },
  YEAR: {
    needsLimit: false,
    displaySize: { min: null, max: null },
    valueRange: null,
  },

  // 枚舉和集合型別
  ENUM: {
    needsLimit: false,
    displaySize: { min: null, max: null },
    valueRange: null,
  },
  SET: {
    needsLimit: false,
    displaySize: { min: null, max: null },
    valueRange: null,
  },
};
