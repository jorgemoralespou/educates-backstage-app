import { createApiRef } from '@backstage/core-plugin-api';
import {
  EducatesCatalogApiExecuteResponse,
  EducatesCatalogApiResponse,
} from './EducatesCatalogApi.model';

export interface EducatesCatalogApi {
  catalog: (user?: string) => Promise<EducatesCatalogApiResponse>;
  execute: (
    environment: string,
    user: string,
  ) => Promise<EducatesCatalogApiExecuteResponse>;
}

export const educatesCatalogApiRef = createApiRef<EducatesCatalogApi>({
  id: 'plugin.educates-catalog.service',
});
