import { useApi } from '@backstage/core-plugin-api';
import { EducatesCatalogApi } from './EducatesCatalogApi';
import {
  EducatesCatalogApiResponse,
  EducatesCatalogApiExecuteResponse,
  Workshop,
  TrainingPortalDetails,
} from './EducatesCatalogApi.model';
import { educatesRestApiRef } from '../rest/EducatesRestApi';
import { educatesKubernetesApiRef } from '../kubernetes/EducatesKubernetesApi';

export class EducatesCatalogApiClient implements EducatesCatalogApi {
  private readonly apiClient = useApi(educatesRestApiRef);
  private readonly apiKubernetesClient = useApi(educatesKubernetesApiRef);

  private thisUser: string = '';

  async catalog(
    portalName: string,
    user?: string,
  ): Promise<EducatesCatalogApiResponse> {
    const trainingPortal = await this.apiKubernetesClient.portal(portalName);

    const tp = {
      ...trainingPortal.status.educates,
      portalName: portalName,
    };

    const resp: EducatesCatalogApiResponse = {
      user: user,
      workshops: new Array<Workshop>(),
      trainingPortal: tp,
    };

    try {
      await this.apiClient.catalog(tp).then(restCatalog => {
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
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }

    return resp;
  }

  async execute(
    trainingPortal: TrainingPortalDetails,
    environment: string,
    user: string,
  ): Promise<string> {
    // Start a workshop using the EducatesRestApi
    const resp = await this.apiClient.execute(
      trainingPortal,
      environment,
      this.thisUser,
    );

    return resp;
  }
}
