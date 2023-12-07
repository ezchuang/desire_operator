import { FieldPacket } from "mysql2";
import parseFieldFlags from "../models/base/tableOptionCompare";

interface DataType {
  COLUMN_NAME: string;
  DATA_TYPE: string;
  CHARACTER_MAXIMUM_LENGTH: number | null;
  COLUMN_DEFAULT: string | null;
}

interface DataTypeObj {
  [key: string]: (string | number | null)[];
}

export default function structureClean(
  structure: FieldPacket[],
  dataType: DataType[]
) {
  // 取出 dataType 中各 Entry 的 (key, value) === item 來生成新的 obj (Type:DataTypeObj)
  // dataTypeObj 的 res 為 {COLUMN_NAME: [DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, COLUMN_DEFAULT]}
  // 用於 cleanedStructure 生成時各 column 的 structure 映射(撈取)
  const dataTypeObj: DataTypeObj = dataType.reduce<DataTypeObj>((obj, item) => {
    if (!obj[item.COLUMN_NAME]) {
      obj[item.COLUMN_NAME] = [];
    }
    obj[item.COLUMN_NAME].push(
      item.DATA_TYPE,
      item.CHARACTER_MAXIMUM_LENGTH,
      item.COLUMN_DEFAULT
    );
    return obj;
  }, {});

  const cleanedStructure = structure.map((element) => {
    return {
      name: element.name,
      type: dataTypeObj[element.name][0],
      length: dataTypeObj[element.name][1],
      default: dataTypeObj[element.name][2],
      flags: parseFieldFlags(element.flags),
    };
  });

  return cleanedStructure;
}
