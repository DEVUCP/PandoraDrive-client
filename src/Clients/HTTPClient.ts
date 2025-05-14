export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";
export type RequestHeaders = Record<string, string>;

export interface RequestConfig {
  url: string;
  method?: RequestMethod;
  headers?: RequestHeaders;
  body?: any;
}

export type Interceptor<T> = (data: T) => Promise<T> | T;

interface HttpClient {
  request: <T>(config: RequestConfig) => Promise<T>;
  get: <T>(url: string, headers?: RequestHeaders) => Promise<T>;
  post: <T>(url: string, headers?: RequestHeaders, body?: any) => Promise<T>;
  put: <T>(url: string, headers?: RequestHeaders, body?: any) => Promise<T>;
  delete: <T>(url: string, headers?: RequestHeaders, body?: any) => Promise<T>;
}

export const createHTTPClient = (
  requestInterceptors: Interceptor<RequestConfig>[] = [],
  responseInterceptors: Interceptor<unknown>[] = [],
): HttpClient => {
  const applyInterceptors = async <T>(
    interceptors: Interceptor<T>[],
    data: T,
  ) => {
    let result = data;
    for (const interceptor of interceptors) {
      result = await interceptor(result);
    }
    return result;
  };

  const request = async <T>(config: RequestConfig): Promise<T> => {
    const finalConfig = await applyInterceptors(requestInterceptors, {
      ...config,
    });

    const headers: RequestHeaders = {
      ...finalConfig.headers,
      "Content-Type":
        finalConfig.headers?.["Content-Type"] || "application/json",
    };
    const requestOptions: RequestInit = {
      method: finalConfig.method || "GET",
      headers,
      credentials: "include",
    };

    // Handle body
    if (finalConfig.body) {
      if (
        finalConfig.body instanceof FormData ||
        finalConfig.body instanceof URLSearchParams
      ) {
        requestOptions.body = finalConfig.body;
      } else {
        requestOptions.body = JSON.stringify(finalConfig.body);
      }
    }
    try {
      const response = await fetch(finalConfig.url, requestOptions);

      if (!response.ok) {
        console.log(await response.text());
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      let responseData: unknown;

      if (contentType?.includes("application/json")) {
        responseData = await response.json();
      } else if (response.status === 204) {
        responseData = {} as T;
      } else {
        responseData = await response.text();
      }

      return (await applyInterceptors(responseInterceptors, responseData)) as T;
    } catch (error) {
      console.error("Request Error", error);
      throw error;
    }
  };

  const get = <T>(
    url: string,
    headers?: RequestHeaders,
    body?: any,
  ): Promise<T> => request<T>({ url, method: "GET", headers });

  const post = <T>(
    url: string,
    headers?: RequestHeaders,
    body?: any,
  ): Promise<T> => request<T>({ url, method: "POST", headers, body });

  const put = <T>(
    url: string,
    headers?: RequestHeaders,
    body?: any,
  ): Promise<T> => request<T>({ url, method: "PUT", headers, body });

  const del = <T>(
    url: string,
    headers?: RequestHeaders,
    body?: any,
  ): Promise<T> => request<T>({ url, method: "DELETE", headers, body });

  return { request, get, post, put, delete: del };
};
