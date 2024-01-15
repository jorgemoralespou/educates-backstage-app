export interface EducatesRequestParams {
  portalName: string;
  url: string;
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
  environment?: string;
  user?: string;
}

export interface EducatesApiCatalogResponse {
  workshops: Array<Workshop>;
}

export interface Workshop {
  environment: Environment;
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
  sessions: Array<Session>;
}

export interface Environment {
  name: string;
  duration: number;
  capacity: number;
  reserved: number;
  allocated: number;
  available: number;
}

export interface Session {
  name: string;
  workshop: string;
  environment: string;
  namespace: string;
  started: string;
  expires: string;
  countdown: number;
  extendable: boolean;
}

export interface EducatesRestApiCatalogResponse {
  // portal: EducatesRestApiCatalogPortal;
  environments: Array<EducatesRestApiCatalogEnvironment>;
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
