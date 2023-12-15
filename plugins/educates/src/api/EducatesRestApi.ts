import { createApiRef } from '@backstage/core-plugin-api';
import {
  EducatesRestApiCatalogResponse,
  EducatesRestApiExecuteResponse,
  EducatesRestApiUserSessionsResponse,
} from './EducatesRestApi.model';

export interface EducatesRestApi {
  catalog: () => Promise<EducatesRestApiCatalogResponse>;
  execute: (
    environment: string,
    user?: string,
  ) => Promise<EducatesRestApiExecuteResponse>;
  activationUrl: (apiResp: EducatesRestApiExecuteResponse) => string;
  getActiveSessions: (
    user: string,
  ) => Promise<EducatesRestApiUserSessionsResponse>;
}

export const educatesRestApiRef = createApiRef<EducatesRestApi>({
  id: 'plugin.educates-rest.service',
});
