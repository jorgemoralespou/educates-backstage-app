import { DiscoveryApi } from '@backstage/core-plugin-api';
import {
  EducatesRequestParams,
  EducatesApiCatalogResponse,
  EducatesRestApiCatalogResponse,
  Workshop,
} from './EducatesApi.model';
import { EducatesApi } from './EducatesApi';

export class EducatesApiClient implements EducatesApi {
  private readonly discoveryApi: DiscoveryApi;

  constructor(options: { discoveryApi: DiscoveryApi }) {
    this.discoveryApi = options.discoveryApi;
  }

  private async handleResponse(response: Response): Promise<any> {
    if (!response.ok) {
      const payload = await response.text();
      let message;
      switch (response.status) {
        case 404:
          message =
            'Could not find the Kubernetes Backend (HTTP 404). Make sure the plugin has been fully installed.';
          break;
        default:
          message = `Request failed with ${response.status} ${response.statusText}, ${payload}`;
      }
      throw new Error(message);
    }

    return await response.json();
  }
  private async postRequired(path: string, requestBody: any): Promise<any> {
    const url = `${await this.discoveryApi.getBaseUrl('educates')}${path}`;
    // eslint-disable-next-line no-console
    console.log('url', url);
    // const { token: idToken } = await this.identityApi.getCredentials();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // ...(idToken && { Authorization: `Bearer ${idToken}` }),
      },
      body: JSON.stringify(requestBody),
    });

    return this.handleResponse(response);
  }

  async catalog(
    params: EducatesRequestParams,
  ): Promise<EducatesApiCatalogResponse> {
    const restCatalog = await this.postRequired(
      `/catalog/${params.portalName}`,
      params,
    );
    return this.translate(restCatalog);
  }

  async execute(params: EducatesRequestParams): Promise<string> {
    return await this.postRequired(`/execute/${params.portalName}`, params);
  }

  translate(
    catalog: EducatesRestApiCatalogResponse,
  ): EducatesApiCatalogResponse {
    const resp: EducatesApiCatalogResponse = {
      workshops: new Array<Workshop>(),
      // trainingPortal: params.portalName,
    };

    catalog.environments.forEach(env => {
      const workshop: Workshop = {
        name: env.workshop.name,
        title: env.workshop.title,
        description: env.workshop.description,
        vendor: env.workshop.vendor,
        authors: env.workshop.authors,
        difficulty: env.workshop.difficulty,
        duration: env.workshop.duration,
        tags: env.workshop.tags,
        labels: env.workshop.labels,
        logo: env.workshop.logo,
        url: env.workshop.url,
        environment: {
          name: env.name,
          duration: env.duration,
          capacity: env.capacity,
          reserved: env.reserved,
          allocated: env.allocated,
          available: env.available,
        },
        sessions: [],
      };
      resp.workshops.push(workshop);
    });
    return resp;
  }
}
