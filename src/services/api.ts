import { BASE_URL } from "./url";

interface FetchResponseInfo {
  status: number;
  statusText: string;
  url: string;
}

interface FetchResponse<T> {
  data: T;
  responseInfo: FetchResponseInfo;
}

export async function fetchWrapper<T = unknown>(
  input?: RequestInfo | URL,
  init?: RequestInit
): Promise<FetchResponse<T>> {
  const data = await fetch(`${BASE_URL}/${input || ""}`, init);

  const responseInfo = {
    status: data.status,
    statusText: data.statusText,
    url: data.url,
  };

  if (!data.ok) {
    throw new Error(
      `HTTP Error: ${data.status} ${data.statusText} at ${data.url}`
    );
  }

  const result: T = await data.json();

  return {
    data: result,
    responseInfo,
  };
}
