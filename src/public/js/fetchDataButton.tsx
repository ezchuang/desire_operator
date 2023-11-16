// 要做在 DB Name 上
export async function fetchDbsAndTables(
  element: HTMLElement
): Promise<[any, any]> {
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

    console.log("rowData: ", result.data);
    console.log("columnData: ", result.structure);
    return [result.data, result.structure];
  } catch (err) {
    console.error("There was an error fetching the DBs and Tables: ", err);
    throw err;
  }
}

// 要做在 DB Name 上
export async function fetchTableData(
  element: HTMLElement
): Promise<[any, any]> {
  const data: Object = {
    dbName: element.getAttribute("dbName"),
    table: element.getAttribute("table"),
    select: null,
    where: null,
    groupBy: null,
    orderBy: null,
    orderDirection: null,
    limit: Number(element.getAttribute("limit")) || 10,
  };

  const response = await fetch("/api/readData", {
    method: "POST",
    body: JSON.stringify(data),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });
  const result = await response.json();
  console.log(result.data);
  console.log(result.structure);

  return [result.data, result.structure];
}
