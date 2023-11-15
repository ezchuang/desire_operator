import { FieldPacket } from "mysql2";
import parseFieldFlags from "../models/base/tableOptionCompare";

interface DataType {
  COLUMN_NAME: string;
  DATA_TYPE: string;
}

interface DataTypeObj {
  [key: string]: string;
}

export default function dataClean(
  structure: FieldPacket[],
  dataType: DataType[]
) {
  const dataTypeObj: DataTypeObj = dataType.reduce<DataTypeObj>((obj, item) => {
    obj[item.COLUMN_NAME] = item.DATA_TYPE;
    return obj;
  }, {});

  const cleanedStructure = structure.map((element) => {
    return {
      name: element.name,
      type: dataTypeObj[element.name],
      flags: parseFieldFlags(element.flags),
    };
  });

  return cleanedStructure;
}
