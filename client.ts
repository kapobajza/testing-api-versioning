import { BaseApi } from "./baseApi";

export class ApiClient extends BaseApi {
  constructor(routePrefix?: string) {
    super(routePrefix);
  }
}

export class ApiClientV1 extends BaseApi {
  constructor(routePrefix?: string) {
    super(routePrefix, "v1");
  }
}

export class ApiClientV2 extends BaseApi {
  constructor(routePrefix?: string) {
    super(routePrefix, "v2");
  }
}

export class ApiClientV3 extends BaseApi {
  constructor(routePrefix?: string) {
    super(routePrefix, "v3");
  }
}
