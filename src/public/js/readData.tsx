import { ReadDataElement } from "./DataContext";

export async function readDbsAndTables(
  element: ReadDataElement
): Promise<any[]> {
  try {
    const response = await fetch("/api/readDbsAndTables", {
      method: "POST",
      body: JSON.stringify(element),
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

export async function readTableData(element: ReadDataElement): Promise<any[]> {
  try {
    const response = await fetch("/api/readData", {
      method: "POST",
      body: JSON.stringify(element),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    const result = await response.json();
    console.log(result.data);
    console.log(result.structure);

    return [result.data, result.structure];
  } catch (err) {
    console.error("There was an error fetching the Tables: ", err);
    throw err;
  }
}
