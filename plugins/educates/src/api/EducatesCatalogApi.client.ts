import { useApi } from '@backstage/core-plugin-api';
import { EducatesCatalogApi } from './EducatesCatalogApi';
import {
  EducatesCatalogApiResponse,
  EducatesCatalogApiExecuteResponse,
  Workshop,
} from './EducatesCatalogApi.model';
import { educatesRestApiRef } from './EducatesRestApi';

export class EducatesCatalogApiClient implements EducatesCatalogApi {
  private readonly apiClient = useApi(educatesRestApiRef);

  private thisUser: string = '';

  async catalog(user?: string): Promise<EducatesCatalogApiResponse> {
    const resp: EducatesCatalogApiResponse = {
      user: user,
      workshops: new Array<Workshop>(),
    };

    await this.apiClient.catalog().then(restCatalog => {
      restCatalog.environments.forEach(env => {
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
    });

    return resp;
  }

  async execute(
    environment: string,
    user: string,
  ): Promise<EducatesCatalogApiExecuteResponse> {
    // Start a workshop using the EducatesRestApi
    const resp = await this.apiClient.execute(environment, this.thisUser);

    if (user === undefined) {
      this.thisUser = resp.user;
    }

    // Get the full URL to the workshop
    const fullUrl = this.apiClient.activationUrl(resp);

    // Augment the response with the full URL
    const augmentedResp: EducatesCatalogApiExecuteResponse = {
      user: resp.user,
      environment: resp.environment,
      url: resp.url,
      name: resp.name,
      workshop: resp.workshop,
      namespace: resp.namespace,
      fullUrl: fullUrl,
    };

    // eslint-disable-next-line no-console
    console.log(augmentedResp);

    return augmentedResp;
  }
}
