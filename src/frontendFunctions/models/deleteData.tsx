import fetchPackager from "./fetchPackager";

// 刪除單列資料
export async function deleteData(element: any): Promise<any> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/deleteData",
      methodFetch: "POST",
      bodyFetch: JSON.stringify(element),
    });

    if (!response.ok) {
      throw new Error(
        `Error with status ${response.status} in delete operation`
      );
    }

    const result = await response.json();
    // console.log("updateData: ", response);

    return result.data;
  } catch (err) {
    console.error(`There was an error in the delete operation: `, err);
    throw err;
  }
}

// 刪除 Table
export async function deleteTable(element: any): Promise<any> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/deleteTable",
      methodFetch: "POST",
      bodyFetch: JSON.stringify(element),
    });

    if (!response.ok) {
      throw new Error(
        `Error with status ${response.status} while dropping table`
      );
    }

    const result = await response.json();

    return result.data;
  } catch (err) {
    console.error("There was an error dropping the table: ", err);
    throw err;
  }
}

// 刪除 Database
export async function deleteDb(element: any): Promise<any> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/deleteDatabase",
      methodFetch: "POST",
      bodyFetch: JSON.stringify(element),
    });

    if (!response.ok) {
      throw new Error(
        `Error with status ${response.status} while dropping database`
      );
    }

    const result = await response.json();

    return result.data;
  } catch (err) {
    console.error("There was an error dropping the database: ", err);
    throw err;
  }
}
