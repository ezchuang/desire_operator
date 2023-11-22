import { ReadDataElement } from "./DataContext";
import fetchPackager from "./fetchPackager";

export async function readDbsAndTables(
  element: ReadDataElement
): Promise<any[]> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/readDbsAndTables",
      methodFetch: "POST",
      bodyFetch: JSON.stringify(element),
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
    const response = await fetchPackager({
      urlFetch: "/api/readData",
      methodFetch: "POST",
      bodyFetch: JSON.stringify(element),
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
