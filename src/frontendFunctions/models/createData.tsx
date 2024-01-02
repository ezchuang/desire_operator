import fetchPackager from "./fetchPackager";
import { ColumnData, OutputColumnData, TableData } from "../types/Interfaces";

// 新建 DB
export async function createDb(element: string): Promise<boolean> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/database",
      methodFetch: "POST",
      bodyFetch: JSON.stringify({ dbName: element }),
    });

    if (response.data) {
      return response.data;
    } else {
      throw new Error(response.message);
    }
  } catch (err) {
    console.error("There was an error fetching the DBs and Tables: ", err);
    throw err;
  }
}

// 將 element.columns 中 { key : value } 的 value 轉成要給後端執行的 Array
function refactorCreateDataParams(element: TableData) {
  // console.log("refactorCreateDataParams處理前: ", element);
  // 額外從 input 資料拉出 PK 資料來處理
  const primaryKeys = (element.columns as ColumnData[])
    .filter((column: ColumnData) => column.isPrimaryKey)
    .map((column) => `\`${column.columnName}\``);

  (element.columns as OutputColumnData[]) = (element.columns as ColumnData[])
    .filter((column) => column.columnName && column.columnType)
    .map((column) => {
      const options = [
        column.isUnsigned ? "UNSIGNED" : "",
        column.isNotNull ? "NOT NULL" : "",
        // 只有非 AUTO_INCREMENT 列才設置 DEFAULT 值
        !column.isAutoIncrement &&
        column.defaultValue !== undefined &&
        column.defaultValue !== null &&
        column.defaultValue !== ""
          ? `DEFAULT '${column.defaultValue}'`
          : "",
        column.isZerofill ? "ZEROFILL" : "",
        column.isAutoIncrement ? "AUTO_INCREMENT" : "",
        // 根據列的設置添加 UNIQUE 約束
        column.isUniqueKey ? "UNIQUE" : "",
      ].filter(Boolean); // 移除 ""

      return {
        name: column.columnName,
        type:
          column.columnType +
          (column.columnSizeLimit
            ? `(${column.columnSizeLimit}${
                column.precisionLimit ? "," + String(column.precisionLimit) : ""
              })`
            : ""),
        options: options,
      };
    })
    .filter(Boolean); // 移除 null (PK)

  // 方便後端操作，將值寫在 type
  if (primaryKeys.length > 0) {
    element.columns.push({
      name: "PRIMARY KEY",
      type: `PRIMARY KEY (${primaryKeys.join(", ")})`,
      options: [],
    });
  }

  // console.log("refactorCreateDataParams: ", element);
  return element;
}

// 新建 Table
export async function createTable(element: TableData): Promise<boolean> {
  try {
    // console.log(element);
    const refactorCreateData = refactorCreateDataParams(element);
    // console.log(refactorCreateData);
    const response = await fetchPackager({
      urlFetch: "/api/table",
      methodFetch: "POST",
      bodyFetch: JSON.stringify(refactorCreateData),
    });

    if (response.data) {
      return response.data;
    } else {
      throw new Error(response.message);
    }
  } catch (err) {
    console.error("There was an error fetching the DBs and Tables: ", err);
    throw err;
  }
}
