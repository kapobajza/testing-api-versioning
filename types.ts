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
