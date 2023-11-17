import { DataElement } from "./DataContext";

export async function fetchDbsAndTables(
  element: DataElement
): Promise<[any, any]> {
  try {
    const data: Object = { dbName: element.dbName || null };
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

export async function fetchTableData(
  element: DataElement
): Promise<[any, any]> {
  const data: Object = {
    dbName: element.dbName,
    table: element.table,
    select: null,
    where: null,
    groupBy: null,
    orderBy: null,
    orderDirection: null,
    limit: 10, // 如果需要动态设置 limit，可将其作为参数传入或从其他地方获取
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
