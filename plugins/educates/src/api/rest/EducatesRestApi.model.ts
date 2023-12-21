export interface EducatesRestApiCatalogResponse {
  portal: EducatesRestApiCatalogPortal;
  environments: Array<EducatesRestApiCatalogEnvironment>;
}

interface EducatesRestApiCatalogPortal {
  name: string;
  displayName: string;
  description: string;
  logo: string;
  url?: string;
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

export interface EducatesOauthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
}

export interface EducatesTokenDetails {
  portalUrl: string;
  token: string;
  client_id: string;
  client_secret: string;
  robot_username: string;
  robot_password: string;
}
