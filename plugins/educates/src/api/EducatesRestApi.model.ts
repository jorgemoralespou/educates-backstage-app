export interface EducatesRestApiCatalogResponse {
  portal: EducatesRestApiCatalogPortal;
  environments: Array<EducatesRestApiCatalogEnvironment>;
}

export interface EducatesRestApiCatalogPortal {
  name: string;
  displayName: string;
  description: string;
  logo: string;
}

export interface EducatesRestApiCatalogEnvironment {
  name: string;
  state: string;
  duration: number;
  capacity: number;
  reserved: number;
  allocated: number;
  available: number;
  workshop: EducatesRestApiCatalogWorkshop;
}

export interface EducatesRestApiCatalogWorkshop {
  name: string;
  title: string;
  description: string;
  vendor: string;
  authors: Array<string>;
  difficulty: string;
  duration: string;
  tags: Array<string>;
  labels: Map<string, string>;
  logo: string;
  url: string;
}

export interface EducatesRestApiExecuteResponse {
  name: string;
  user: string;
  url: string;
  workshop: string;
  environment: string;
  namespace: string;
}

export interface EducatesRestApiUserSessionsResponse {
  user: string;
  sessions: Array<EducatesRestApiUserSession>;
}

export interface EducatesRestApiUserSession {
  name: string;
  workshop: string;
  environment: string;
  namespace: string;
  started: string;
  expires: string;
  countdown: number;
  extendable: boolean;
}
