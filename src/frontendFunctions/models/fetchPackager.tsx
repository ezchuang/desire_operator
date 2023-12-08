// 封裝 fetch 請求
const requestCache = new Map();
const cacheTimeout = 500; // 快取存在時限

interface FetchPackagerConfig {
  urlFetch: string;
  methodFetch: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headersFetch?: Record<string, string>;
  bodyFetch?: string | null;
}

function generateCacheKey(config: FetchPackagerConfig): string {
  return JSON.stringify({
    url: config.urlFetch,
    method: config.methodFetch,
    headers: config.headersFetch,
    body: config.bodyFetch,
  });
}

export default function fetchPackager(
  config: FetchPackagerConfig
): Promise<any> {
  const cacheKey = generateCacheKey(config); // 轉成Json string
  // 若時限內該使用者有做過同樣的指令，則回傳快取 Promise 給他
  // 此時並未確認 Promise 解析結果
  // 因為回傳的是同一個 物件，所以會一直在 await 的地方(呼叫此函式的地方)等到他完成
  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey);
  }

  const headers = new Headers(
    config.headersFetch || {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    }
  );

  const fetchPromise = new Promise((resolve, reject) => {
    fetch(config.urlFetch || "/", {
      method: config.methodFetch || "GET",
      headers: headers,
      body: config.bodyFetch || null,
    })
      .then(async (response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(
              errorData.message || `HTTP error! status: ${response.status}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {
        setTimeout(() => requestCache.delete(cacheKey), cacheTimeout);
      });
  });

  // requestCache.delete(cacheKey) // 保留，不過應該沒有必要
  requestCache.set(cacheKey, fetchPromise); // 將 "Promise" 存進內存

  return fetchPromise;
}
