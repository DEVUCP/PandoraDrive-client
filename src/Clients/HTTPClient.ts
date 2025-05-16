import Status from "../Enums/Status";

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";
export type RequestHeaders = Record<string, string>;

export interface RequestConfig {
  url: string;
  method?: RequestMethod;
  headers?: RequestHeaders;
  body?: any;
}

export interface RequestError extends Error {
  response?: Response;
  request?: RequestInit;
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
    };
    if (
      !(finalConfig.body instanceof FormData) &&
      !(finalConfig.body instanceof URLSearchParams) &&
      !headers["Content-Type"]
    ) {
      headers["Content-Type"] = "application/json";
    }

    const requestOptions: RequestInit = {
      method: finalConfig.method || "GET",
      headers,
      credentials: "include",
    };

    // Handle body
    if (finalConfig.body) {
      if (finalConfig.body instanceof FormData) {
        requestOptions.body = finalConfig.body;
        if (headers["Content-Type"]) delete headers["Content-Type"];
      } else if (finalConfig.body instanceof URLSearchParams) {
        requestOptions.body = finalConfig.body;
      } else {
        requestOptions.body = JSON.stringify(finalConfig.body);
      }
    }
    try {
      const response = await fetch(finalConfig.url, requestOptions);

      if (!response.ok) {
        const error: RequestError = new Error(
          `HTTP error! Status: ${response.status}`,
        );
        error.response = response;
        error.request = requestOptions;
        throw error;
      }

      const contentType = response.headers.get("content-type");
      let responseData: unknown;

      if (contentType?.includes("application/json")) {
        responseData = await response.json();
      } else if (response.status === Status.NO_CONTENT) {
        responseData = {} as T;
      } else {
        responseData = await response.text();
      }

      return applyInterceptors(
        responseInterceptors,
        responseData,
      ) as Promise<T>;
    } catch (error) {
      const requestError: RequestError =
        error instanceof Error ? error : new Error("Unknown error");

      return applyInterceptors(
        responseInterceptors,
        requestError,
      ) as Promise<T>;
    }
  };

  const get = <T>(url: string, headers?: RequestHeaders): Promise<T> =>
    request<T>({ url, method: "GET", headers });

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
