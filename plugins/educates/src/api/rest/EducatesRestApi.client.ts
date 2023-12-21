import { FetchApi } from '@backstage/core-plugin-api';
import {
  EducatesOauthResponse,
  EducatesRestApiCatalogResponse,
  EducatesRestApiExecuteResponse,
  EducatesRestApiUserSessionsResponse,
  EducatesTokenDetails,
} from './EducatesRestApi.model';
import { EducatesRestApi } from './EducatesRestApi';
import { EducatesKubernetesApi } from '../kubernetes/EducatesKubernetesApi';
import { TrainingPortalDetails } from '../catalog/EducatesCatalogApi.model';

export class EducatesRestApiClient implements EducatesRestApi {
  private readonly fetchApi: FetchApi;
  private readonly educatesKubernetesApi: EducatesKubernetesApi;

  constructor(options: {
    fetchApi: FetchApi;
    educatesKubernetesApi: EducatesKubernetesApi;
  }) {
    this.fetchApi = options.fetchApi;
    this.educatesKubernetesApi = options.educatesKubernetesApi;
  }

  private async login(
    portalDetails: TrainingPortalDetails,
  ): Promise<{ tokenDetails: EducatesTokenDetails }> {
    const baseUrl = portalDetails.url;
    const { id, secret } = portalDetails.clients.robot;
    const { username, password } = portalDetails.credentials.robot;

    const token = `Basic ${btoa(`${id}:${secret}`)}`;
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/x-www-form-urlencoded');
    requestHeaders.set('Authorization', `${token}`);

    const resp = await fetch(`${baseUrl}/oauth2/token/`, {
      method: 'POST',
      headers: requestHeaders,
      body: `grant_type=password&username=${username}&password=${password}`,
    }).then(r => r.json());
    return {
      tokenDetails: {
        portalUrl: baseUrl,
        token: resp.access_token,
        client_id: id,
        client_secret: secret,
        robot_username: username,
        robot_password: password,
      },
    };
  }

  private async logout(tokenDetails: EducatesTokenDetails): Promise<void> {
    const token = `Basic ${btoa(
      `${tokenDetails.client_id}:${tokenDetails.client_secret}`,
    )}`;
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/x-www-form-urlencoded');
    requestHeaders.set('Authorization', `${token}`);

    await fetch(`${tokenDetails.portalUrl}/oauth2/revoke-token/`, {
      method: 'POST',
      headers: requestHeaders,
      body: `token=${tokenDetails.token}&client_id=${tokenDetails.client_id}&client_secret=${tokenDetails.client_secret}`,
    });
    return;
  }

  private async loginFetchLogout<T = any>(
    portalDetails: TrainingPortalDetails,
    input: string,
    init?: RequestInit,
  ): Promise<T> {
    const { tokenDetails } = await this.login(portalDetails);
    const token = `Bearer ${tokenDetails.token}`;
    const requestHeaders: HeadersInit = new Headers();
    // requestHeaders.set('Content-Type', 'application/x-www-form-urlencoded');
    requestHeaders.set('Authorization', `${token}`);

    const resp = await this.fetchApi
      .fetch(`${tokenDetails.portalUrl}${input}`, {
        method: init?.method,
        headers: requestHeaders,
        body: init?.body,
      })
      .then(r => r.json())
      .finally(() => {
        this.logout(tokenDetails);
      });
    return resp;
  }

  async catalog(
    portalDetails: TrainingPortalDetails,
  ): Promise<EducatesRestApiCatalogResponse> {
    return await this.loginFetchLogout<EducatesRestApiCatalogResponse>(
      portalDetails,
      '/workshops/catalog/environments/',
      {
        method: 'GET',
      },
    );
  }

  async execute(
    portalDetails: TrainingPortalDetails,
    environment: string,
    user?: string,
  ): Promise<string> {
    // curl -H "Authorization: Bearer <access-token>" https://lab-markdown-sample-ui.test/workshops/environment/<name>/request/?index_url=https://hub.test/
    // EducatesRestApiExecuteResponse
    const userParam = user !== undefined ? `&user=${user}` : '';
    const resp = await this.loginFetchLogout<EducatesRestApiExecuteResponse>(
      portalDetails,
      `/workshops/environment/${environment}/request/?index_url=https://localhost:3000/${userParam}`,
      {
        method: 'GET',
      },
    );
    return `${portalDetails.url}/${resp.url}`;
  }

  async getActiveSessions(
    portalDetails: TrainingPortalDetails,
    user?: string | undefined,
  ): Promise<EducatesRestApiUserSessionsResponse> {
    const resp =
      await this.loginFetchLogout<EducatesRestApiUserSessionsResponse>(
        portalDetails,
        `/user/${user}/sessions/`,
        {
          method: 'GET',
        },
      );
    return resp;
  }
}
