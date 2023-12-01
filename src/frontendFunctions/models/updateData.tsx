import {
  UpdateObj,
  InsertObj,
  AddColumnObj,
  delColumnObj,
} from "../types/Interfaces";
import fetchPackager from "./fetchPackager";

export async function updateData(element: UpdateObj): Promise<any> {
  try {
    const response: any = await fetchPackager({
      urlFetch: "/api/updateData",
      methodFetch: "POST",
      bodyFetch: JSON.stringify(element),
    });

    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    const result = await response.json();
    // console.log("updateData: ", response);

    return result.data;
  } catch (err) {
    // 未測試
    console.error("Error in updateData: ", err);
    throw err;
  }
}

export async function insertData(element: InsertObj): Promise<any> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/insertData",
      methodFetch: "POST",
      bodyFetch: JSON.stringify(element),
    });

    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    const result = await response.json();
    // console.log("insertData: ", response);

    return result.data;
  } catch (err) {
    // 未測試
    console.error("Error in insertData: ", err);
    throw err;
  }
}

export async function addColumn(element: AddColumnObj): Promise<any> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/addColumn", // 假設的 API 端點
      methodFetch: "POST",
      bodyFetch: JSON.stringify(element),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    return result.data;
  } catch (err) {
    // 未測試
    console.error("Error in addColumn:", err);
    throw err;
  }
}

export async function delColumn(element: delColumnObj): Promise<any> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/delColumn", // 假設的 API 端點
      methodFetch: "POST",
      bodyFetch: JSON.stringify(element),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    return result.data;
  } catch (err) {
    // 未測試
    console.error("Error in delColumn:", err);
    throw err;
  }
}
