import { AxiosRequestConfig } from "axios";

export interface QueryParams<SortModel = unknown> extends Record<string, any> {
  page?: number;
  limit?: number;
  order?: "asc" | "desc";
  sort?: (keyof SortModel)[];
}

export interface MutationRequestParams<RequestBody = any> {
  route?: string;
  body?: RequestBody;
  options?: AxiosRequestConfig;
  queryParams?: QueryParams<any>;
}

export type RequestParams<RequestBody = any> =
  | string
  | MutationRequestParams<RequestBody>;

export type ApiClient = {
  get: <ResponseData>(
    paramsOrRoute?: RequestParams,
    params?: Omit<MutationRequestParams<any>, "body">
  ) => Promise<ResponseData>;
  post: <RequestBody = unknown>(
    paramsOrRoute?: RequestParams<RequestBody> | undefined,
    params?: MutationRequestParams
  ) => Promise<RequestBody>;
  put: <RequestBody = unknown>(
    paramsOrRoute?: RequestParams | string,
    params?: MutationRequestParams
  ) => Promise<RequestBody>;
  delete: (
    paramsOrRoute?: RequestParams | string,
    params?: MutationRequestParams
  ) => Promise<unknown>;
};

export type ApiVersion = "v1" | "v2" | "v3";

export type CreateBaseApiFactoryFn = (
  version?: ApiVersion
) => (routePrefix?: string) => ApiClient;
