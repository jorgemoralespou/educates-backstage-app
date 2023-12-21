import { createApiRef } from '@backstage/core-plugin-api';
import {
  EducatesCatalogApiExecuteResponse,
  EducatesCatalogApiResponse,
} from './EducatesCatalogApi.model';
import { TrainingPortalDetails } from '../catalog/EducatesCatalogApi.model';

export interface EducatesCatalogApi {
  catalog: (
    portalName: string,
    user?: string,
  ) => Promise<EducatesCatalogApiResponse>;

  execute: (
    portalDetails: TrainingPortalDetails,
    environment: string,
    user: string,
  ) => Promise<string>;
}

export const educatesCatalogApiRef = createApiRef<EducatesCatalogApi>({
  id: 'plugin.educates-catalog.service',
});
