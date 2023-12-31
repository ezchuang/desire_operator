import { ReadDataElement } from "../types/ReadDataContext";
import fetchPackager from "./fetchPackager";

// 取得 DBs or Tables
export async function readDbsOrTables(
  element: ReadDataElement
): Promise<any[]> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/readDbsOrTables",
      methodFetch: "POST",
      bodyFetch: JSON.stringify(element),
    });

    return [response.data, response.structure];
  } catch (err) {
    console.error("There was an error fetching the DBs and Tables: ", err);
    throw err;
  }
}

// 取得全部的 DBs 跟 Tables
export async function readDbsAndTables(): Promise<any[]> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/readDbsAndTables",
      methodFetch: "POST",
      bodyFetch: JSON.stringify({}),
    });

    return [response.data, response.structure];
  } catch (err) {
    console.error("There was an error fetching the DBs and Tables: ", err);
    throw err;
  }
}

// 讀取 Table 內部資料
export async function readTableData(element: ReadDataElement): Promise<any[]> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/readData",
      methodFetch: "POST",
      bodyFetch: JSON.stringify(element),
    });

    return [response.data, response.structure];
  } catch (err) {
    console.error("There was an error fetching the Tables: ", err);
    throw err;
  }
}

// 讀取歷史資料
export async function readHistoryData(): Promise<any[]> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/getHistoryByUser",
      methodFetch: "GET",
    });

    // console.log(result.data);
    // console.log(result.structure);

    return [response.data, response.structure];
  } catch (err) {
    console.error("There was an error fetching the Tables: ", err);
    throw err;
  }
}
