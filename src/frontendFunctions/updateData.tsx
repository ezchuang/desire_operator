import { UpdateObj } from "./DataContext";
import fetchPackager from "./fetchPackager";

export async function updateData(element: UpdateObj): Promise<any> {
  try {
    const response = await fetchPackager({
      urlFetch: "/api/updateData",
      methodFetch: "POST",
      bodyFetch: JSON.stringify(element),
    });

    console.log(response);

    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    return;
  } catch (err) {
    console.error("Error in updateData: ", err);
  }
}
