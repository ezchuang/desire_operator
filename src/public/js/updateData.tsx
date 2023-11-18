import { UpdateObj } from "./DataContext";

export async function updateData(element: UpdateObj): Promise<any> {
  try {
    const response = await fetch("/api/updateData", {
      method: "POST",
      body: JSON.stringify(element),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
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
