export interface EducatesBackendApiCatalogResponse {
  portal: EducatesBackendApiCatalogPortal;
  environments: Array<EducatesBackendApiCatalogEnvironment>;
}

interface EducatesBackendApiCatalogPortal {
  name: string;
  displayName: string;
  description: string;
  logo: string;
  url?: string;
}

export interface EducatesBackendApiCatalogEnvironment {
  name: string;
  state: string;
  duration: number;
  capacity: number;
  reserved: number;
  allocated: number;
  available: number;
  workshop: EducatesBackendApiCatalogWorkshop;
}

export interface EducatesBackendApiCatalogWorkshop {
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

export interface EducatesBackendApiExecuteResponse {
  name: string;
  user: string;
  url: string;
  workshop: string;
  environment: string;
  namespace: string;
}

export interface EducatesBackendApiUserSessionsResponse {
  user: string;
  sessions: Array<EducatesBackendApiUserSession>;
}

export interface EducatesBackendApiUserSession {
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

export interface TrainingPortalDetails {
  portalName: string;
  namespace: string;
  phase: string;
  url: string;
  clients: TrainingPortalStatusEducatesClients;
  credentials: TrainingPortalStatusEducatesCredentials;
}

interface TrainingPortalStatusEducatesClients {
  robot: TrainingPortalClients;
}

interface TrainingPortalClients {
  id: string;
  secret: string;
}

interface TrainingPortalStatusEducatesCredentials {
  admin: TrainingPortalCredentials;
  robot: TrainingPortalCredentials;
}

interface TrainingPortalCredentials {
  username: string;
  password: string;
}

export interface TrainingPortalDetails {
  portalName: string;
  namespace: string;
  phase: string;
  url: string;
  clients: TrainingPortalStatusEducatesClients;
  credentials: TrainingPortalStatusEducatesCredentials;
}

interface TrainingPortalStatusEducatesClients {
  robot: TrainingPortalClients;
}

interface TrainingPortalClients {
  id: string;
  secret: string;
}

interface TrainingPortalStatusEducatesCredentials {
  admin: TrainingPortalCredentials;
  robot: TrainingPortalCredentials;
}

interface TrainingPortalCredentials {
  username: string;
  password: string;
}

export interface CatalogRequestParams {
  portalName: string;
  url: string;
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
}

export interface ExecuteRequestParams {
  portalName: string;
  url: string;
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
  environment: string;
  user?: string;
}
