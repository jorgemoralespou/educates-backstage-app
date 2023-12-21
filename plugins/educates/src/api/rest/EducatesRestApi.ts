import { createApiRef } from '@backstage/core-plugin-api';
import {
  EducatesRestApiCatalogResponse,
  EducatesRestApiExecuteResponse,
  EducatesRestApiUserSessionsResponse,
} from './EducatesRestApi.model';
import { TrainingPortalDetails } from '../catalog/EducatesCatalogApi.model';

export interface EducatesRestApi {
  catalog: (
    portalDetails: TrainingPortalDetails,
  ) => Promise<EducatesRestApiCatalogResponse>;
  execute: (
    portalDetails: TrainingPortalDetails,
    environment: string,
    user?: string,
  ) => Promise<string>;
  getActiveSessions: (
    portalDetails: TrainingPortalDetails,
    user: string,
  ) => Promise<EducatesRestApiUserSessionsResponse>;
}

export const educatesRestApiRef = createApiRef<EducatesRestApi>({
  id: 'plugin.educates-rest.service',
});
