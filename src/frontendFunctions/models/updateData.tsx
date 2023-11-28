import { UpdateObj, InsertObj } from "../types/Interfaces";
import fetchPackager from "./fetchPackager";

export async function updateData(element: UpdateObj): Promise<any> {
  try {
    const response = await fetchPackager({
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
    console.error("Error in updateData: ", err);
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
    console.error("Error in updateData: ", err);
  }
}
