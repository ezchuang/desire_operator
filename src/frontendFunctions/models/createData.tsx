// import { ReadDataElement } from "../types/ReadDataContext";
import fetchPackager from "./fetchPackager";

interface TableData {
  dbName: string;
  table: string;
  columns: any[];
}

// 新建 DB
export async function createDb(element: string): Promise<boolean> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/createDb",
      methodFetch: "POST",
      bodyFetch: JSON.stringify({ dbName: element }),
    });

    const result = await response.json();
    if (result.data) {
      return result.data;
    } else {
      throw Error;
    }
  } catch (err) {
    console.error("There was an error fetching the DBs and Tables: ", err);
    throw err;
  }
}

// 新建 Table
// 回頭處理 any
export async function createTable(element: TableData): Promise<boolean> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/createTable",
      methodFetch: "POST",
      bodyFetch: JSON.stringify(refactorCreateDataParams(element)),
    });

    const result = await response.json();
    if (result.data) {
      return result.data;
    } else {
      throw Error;
    }
  } catch (err) {
    console.error("There was an error fetching the DBs and Tables: ", err);
    throw err;
  }
}

function refactorCreateDataParams(element: TableData) {
  const validColumns = element.columns.filter(
    (column) => column.columnName && column.columnType
  );
  element.columns = validColumns.map((column) => {
    const options = [];
    if (column.isPrimaryKey) {
      options.push("PRIMARY KEY");
    }
    if (column.isNotNull) {
      options.push("NOT NULL");
    }
    if (column.isUnsigned) {
      options.push("UNSIGNED");
    }
    if (column.isForeignKey) {
      options.push("FOREIGN KEY");
    }

    return {
      name: column.columnName,
      type: column.columnType,
      options: options,
    };
  });
  return element;
}
