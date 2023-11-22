// 封裝 fetch 請求
interface FetchPackagerConfig {
  urlFetch: string;
  methodFetch: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headersFetch?: Record<string, string>;
  bodyFetch?: string | null;
}

export default function fetchPackager({
  urlFetch = "/",
  methodFetch = "GET",
  headersFetch = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
  bodyFetch = null,
}: FetchPackagerConfig): Promise<Response> {
  const headers = new Headers(headersFetch);
  return fetch(urlFetch, {
    method: methodFetch,
    headers: headers,
    body: bodyFetch,
  });
}
