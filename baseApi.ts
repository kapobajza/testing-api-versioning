import axios, { AxiosInstance } from "axios";

import { QueryParams, MutationRequestParams, RequestParams } from "./types";

export abstract class BaseApi {
  private client: AxiosInstance;
  private apiUnversionedPath = "https://jsonplaceholder.typicode.com";

  private getVersionedApiUrl = (version: "v1" | "v2" | "v3" | undefined) => {
    return `${this.apiUnversionedPath}${version ? `/${version}` : ``}`;
  };

  constructor(protected routePrefix?: string, version?: "v1" | "v2" | "v3") {
    this.routePrefix = routePrefix;
    this.client = axios.create({
      // Versioned URL
      baseURL: this.getVersionedApiUrl(version),
      // Non-version URL
      // baseURL: this.apiUnversionedPath,
    });

    this.client.interceptors.request.use((config) => {
      const uri = axios.getUri(config);
      console.log("-------uri-------");
      console.log(uri);
      console.log("-------uri-------\n");
      return config;
    });
  }

  private getRouteWithPrefix(route: string | undefined) {
    let finalRoute = "";

    if (this.routePrefix) {
      finalRoute += `${this.routePrefix}${route ? "/" : ""}`;
    }

    if (route) {
      finalRoute += route;
    }

    return finalRoute;
  }

  private getQueryParams(params: QueryParams | undefined) {
    if (params) {
      const { limit, page, order, sort, ...otherParams } = params || {};

      let _sort: string | undefined = undefined;

      if (sort) {
        _sort = sort.join(",");
      }

      return {
        ...otherParams,
        _limit: params.limit,
        _page: params.page,
        _order: params.order,
        _sort,
      };
    }
  }

  private getRequestParams<RequestBody = any>(
    paramsOrRoute?: RequestParams<RequestBody>,
    params?: MutationRequestParams<RequestBody>
  ) {
    let finalParams: MutationRequestParams = {
      route: this.routePrefix,
      body: undefined,
      options: undefined,
    };

    if (typeof paramsOrRoute === "string") {
      finalParams = {
        route: this.getRouteWithPrefix(paramsOrRoute),
        body: params?.body,
        options: params?.options,
        queryParams: this.getQueryParams(params?.queryParams),
      };
    } else if (typeof paramsOrRoute === "object") {
      finalParams = {
        route: this.getRouteWithPrefix(paramsOrRoute.route),
        body: paramsOrRoute?.body,
        options: paramsOrRoute?.options,
        queryParams: this.getQueryParams(paramsOrRoute?.queryParams),
      };
    }

    return finalParams;
  }

  async getRequest<ResponseData>(
    paramsOrRoute?: RequestParams,
    params?: Omit<MutationRequestParams<any>, "body">
  ) {
    const {
      route = "",
      options,
      queryParams,
    } = this.getRequestParams(paramsOrRoute, params);

    const { data } = await this.client.get<ResponseData>(route, {
      ...(options ?? {}),
      params: queryParams,
    });

    return data;
  }

  async postRequest<RequestBody = any>(
    paramsOrRoute?: RequestParams<RequestBody> | string,
    params?: MutationRequestParams
  ) {
    const {
      route = "",
      options,
      body,
    } = this.getRequestParams(paramsOrRoute, params);
    const { data } = await this.client.post<RequestBody>(route, body, options);
    return data;
  }

  async putRequest<RequestBody = any>(
    paramsOrRoute?: RequestParams | string,
    params?: MutationRequestParams
  ) {
    const {
      route = "",
      options,
      body,
    } = this.getRequestParams(paramsOrRoute, params);
    const { data } = await this.client.put<RequestBody>(route, body, options);
    return data;
  }

  async deleteRequest(
    paramsOrRoute?: RequestParams | string,
    params?: MutationRequestParams
  ) {
    const { route = "", options } = this.getRequestParams(
      paramsOrRoute,
      params
    );
    const { data } = await this.client.delete(route, options);
    return data;
  }
}
