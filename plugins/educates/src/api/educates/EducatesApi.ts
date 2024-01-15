import { createApiRef } from '@backstage/core-plugin-api';
import {
  EducatesRequestParams,
  EducatesApiCatalogResponse,
} from './EducatesApi.model';

export interface EducatesApi {
  catalog: (
    params: EducatesRequestParams,
  ) => Promise<EducatesApiCatalogResponse>;

  execute: (params: EducatesRequestParams) => Promise<string>;
}

export const educatesApiRef = createApiRef<EducatesApi>({
  id: 'plugin.educates-api.service',
});
