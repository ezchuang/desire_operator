// 要做在 DB Name 上
export async function fetchDbsAndTables(
  element: HTMLElement
): Promise<[any[], any[]]> {
  try {
    // 若 dbmame 為空則取值為 null
    const data: Object = { dbName: element.getAttribute("dbName") || null };
    const response = await fetch("/api/readDbsAndTables", {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });

    const result = await response.json();
    const [rowData, columnData] = [result.data, result.structure]; // 分解數據和列結構
    console.log("rowData: ", rowData);
    console.log("columnData: ", columnData);
    return [rowData, columnData];
  } catch (err) {
    console.error("There was an error fetching the DBs and Tables: ", err);
    throw err; // 或者你可以返回一個錯誤指示，如：return [null, null];
  }
}

// 要做在 DB Name 上
export async function fetchTableData(element: HTMLElement) {
  const data: Object = {
    dbName: element.getAttribute("dbName"),
    table: element.getAttribute("table"),
    select: null,
    where: null,
    groupBy: null,
    orderBy: null,
    orderDirection: null,
    limit: 10,
  };

  const response = await fetch("/api/readData", {
    method: "POST",
    body: JSON.stringify(data),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });
  const result = await response.json();
  // const [rowData, columnData] = [result.data, result.structure]; // 分解數據和列結構
  // console.log("rowData: ", rowData);
  // console.log("columnData: ", columnData);
  return [result.data, result.structure];
}
