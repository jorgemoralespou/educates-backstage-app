import {
  DiscoveryApi,
  FetchApi,
  IdentityApi,
} from '@backstage/core-plugin-api';
import {
  EducatesRestApiCatalogResponse,
  EducatesRestApiExecuteResponse,
  EducatesRestApiUserSessionsResponse,
} from './EducatesRestApi.model';
import { EducatesRestApi } from './EducatesRestApi';

export class EducatesRestApiClient implements EducatesRestApi {
  private readonly identityApi: IdentityApi;
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  private discoveredProxyUri: string | undefined;

  private privateUser: string | undefined;

  constructor(options: {
    identityApi: IdentityApi;
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
  }) {
    this.identityApi = options.identityApi;
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
    // this.identityApi.getCredentials().then(creds => {
    //   this.privateUser = creds.token;
    // });
  }

  private async fetch<T = any>(input: string, init?: RequestInit): Promise<T> {
    // As configured previously for the backend proxy
    const proxyUri = `${await this.discoveryApi.getBaseUrl('proxy')}/educates`;
    if (this.discoveredProxyUri !== proxyUri) {
      this.discoveredProxyUri = proxyUri;
    }

    const resp = await this.fetchApi.fetch(`${proxyUri}${input}`, init);
    if (!resp.ok) throw new Error(resp.statusText);
    return await resp.json();
  }

  async catalog(): Promise<EducatesRestApiCatalogResponse> {
    return await this.fetch<EducatesRestApiCatalogResponse>(
      '/workshops/catalog/environments/',
      {
        method: 'GET',
      },
    );
  }

  async execute(
    environment: string,
    user?: string,
  ): Promise<EducatesRestApiExecuteResponse> {
    // curl -H "Authorization: Bearer <access-token>" https://lab-markdown-sample-ui.test/workshops/environment/<name>/request/?index_url=https://hub.test/
    // EducatesRestApiExecuteResponse
    const userParam = user !== undefined ? `&user=${user}` : '';
    const resp = await this.fetch<EducatesRestApiExecuteResponse>(
      `/workshops/environment/${environment}/request/?index_url=https://localhost:3000/${userParam}`,
      {
        method: 'GET',
      },
    );
    return resp;
  }

  activationUrl(apiResp: EducatesRestApiExecuteResponse): string {
    // As configured previously for the backend proxy
    return `https://backstage-educates-plugin-ui.cluster-eu.spring-staging.academy${apiResp.url}`;
  }

  async getActiveSessions(
    user?: string | undefined,
  ): Promise<EducatesRestApiUserSessionsResponse> {
    const resp = await this.fetch<EducatesRestApiUserSessionsResponse>(
      `/user/${user}/sessions/`,
      {
        method: 'GET',
      },
    );
    return resp;
  }
}
