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

    if (response.data) {
      return response.data;
    } else {
      throw Error;
    }
  } catch (err) {
    console.error("There was an error fetching the DBs and Tables: ", err);
    throw err;
  }
}

// 新建 Table
export async function createTable(element: TableData): Promise<boolean> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/createTable",
      methodFetch: "POST",
      bodyFetch: JSON.stringify(refactorCreateDataParams(element)),
    });

    if (response.data) {
      return response.data;
    } else {
      throw Error;
    }
  } catch (err) {
    console.error("There was an error fetching the DBs and Tables: ", err);
    throw err;
  }
}

// 將 element.columns 中 { key : value } 的 value 轉成要給後端執行的 Array
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
