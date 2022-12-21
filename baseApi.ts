import axios from "axios";

import {
  QueryParams,
  MutationRequestParams,
  RequestParams,
  CreateBaseApiFactoryFn,
} from "./types";

const __API_UNVERSIONED_PATH__ = "https://jsonplaceholder.typicode.com";

const getRouteWithPrefix = (
  route: string | undefined,
  routePrefix?: string
) => {
  let finalRoute = "";

  if (routePrefix) {
    finalRoute += `${routePrefix}${route ? "/" : ""}`;
  }

  if (route) {
    finalRoute += route;
  }

  return finalRoute;
};

const getApiRequestHelperFactory = (routePrefix: string | undefined) => {
  const getQueryParams = (params: QueryParams | undefined) => {
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
  };

  return {
    getRequestParams: <RequestBody = any>(
      paramsOrRoute?: RequestParams<RequestBody>,
      params?: MutationRequestParams<RequestBody>
    ) => {
      let finalParams: MutationRequestParams = {
        route: routePrefix,
        body: undefined,
        options: undefined,
      };

      if (typeof paramsOrRoute === "string") {
        finalParams = {
          route: getRouteWithPrefix(paramsOrRoute),
          body: params?.body,
          options: params?.options,
          queryParams: getQueryParams(params?.queryParams),
        };
      } else if (typeof paramsOrRoute === "object") {
        finalParams = {
          route: getRouteWithPrefix(paramsOrRoute.route),
          body: paramsOrRoute?.body,
          options: paramsOrRoute?.options,
          queryParams: getQueryParams(paramsOrRoute?.queryParams),
        };
      }

      return finalParams;
    },
  };
};

export const createBaseApi: CreateBaseApiFactoryFn = (version) => {
  const client = axios.create({
    // Versioned URL
    baseURL: `${__API_UNVERSIONED_PATH__}${version ? `/${version}` : ""}`,
    // Non-version URL
    // baseURL: apiUnversionedPath,
  });

  client.interceptors.request.use((config) => {
    const uri = axios.getUri(config);
    console.log("-------uri-------");
    console.log(uri);
    console.log("-------uri-------\n");
  });

  return (routePrefix?: string) => {
    const { getRequestParams } = getApiRequestHelperFactory(routePrefix);

    return {
      get: async <ResponseData>(
        paramsOrRoute?: RequestParams,
        params?: Omit<MutationRequestParams<any>, "body">
      ) => {
        const {
          route = "",
          options,
          queryParams,
        } = getRequestParams(paramsOrRoute, params);

        const { data } = await client.get<ResponseData>(route, {
          ...(options ?? {}),
          params: queryParams,
        });

        return data;
      },

      post: async <RequestBody = any>(
        paramsOrRoute?: RequestParams<RequestBody> | string,
        params?: MutationRequestParams
      ) => {
        const {
          route = "",
          options,
          body,
        } = getRequestParams(paramsOrRoute, params);
        const { data } = await client.post<RequestBody>(route, body, options);
        return data;
      },

      put: async <RequestBody = any>(
        paramsOrRoute?: RequestParams | string,
        params?: MutationRequestParams
      ) => {
        const {
          route = "",
          options,
          body,
        } = getRequestParams(paramsOrRoute, params);
        const { data } = await client.put<RequestBody>(route, body, options);
        return data;
      },

      delete: async (
        paramsOrRoute?: RequestParams | string,
        params?: MutationRequestParams
      ) => {
        const { route = "", options } = getRequestParams(paramsOrRoute, params);

        const { data } = await client.delete(route, options);
        return data;
      },
    };
  };
};
