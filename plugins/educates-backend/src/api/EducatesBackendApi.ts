import {
  CatalogRequestParams,
  ExecuteRequestParams,
} from './EducatesBackendApi.model';
import { EducatesBackendApiCatalogResponse } from './EducatesBackendApi.model';

export interface EducatesBackendApi {
  catalog: (
    params: CatalogRequestParams,
  ) => Promise<EducatesBackendApiCatalogResponse>;
  execute: (params: ExecuteRequestParams) => Promise<string>;
}
