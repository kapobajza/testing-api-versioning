import { createBaseApi } from "./baseApi";

export const createApiClient = createBaseApi();

export const createApiClientV1 = createBaseApi("v1");

export const createApiClientV2 = createBaseApi("v2");

export const createApiClientV3 = createBaseApi("v3");
