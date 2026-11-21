import type { APIRequestContext } from '@playwright/test';
import { toApiForm, type UserData } from '../data/userFactory';

/** automationexercise.com returns HTTP 200 and puts the "real" status in the body's responseCode. */
export interface ApiResult<T = Record<string, unknown>> {
  httpStatus: number;
  body: { responseCode: number; message?: string } & T;
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

/** Thin wrapper over https://automationexercise.com/api_list, used for fast data setup/teardown and API tests. */
export class UserApi {
  constructor(private readonly request: APIRequestContext) {}

  /** Generic call - also used for negative scenarios (unsupported methods, missing params). */
  async call<T = Record<string, unknown>>(
    method: Method,
    path: string,
    form?: Record<string, string>,
  ): Promise<ApiResult<T>> {
    const res = await this.request.fetch(`/api/${path}`, { method, form });
    return { httpStatus: res.status(), body: await res.json() };
  }

  createAccount(user: UserData) { return this.call('POST', 'createAccount', toApiForm(user)); }
  deleteAccount(email: string, password: string) { return this.call('DELETE', 'deleteAccount', { email, password }); }
  verifyLogin(email: string, password: string) { return this.call('POST', 'verifyLogin', { email, password }); }
}
