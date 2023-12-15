export interface EducatesCatalogApiResponse {
  user?: string;
  workshops: Array<Workshop>;
}

export interface EducatesCatalogApiExecuteResponse {
  name: string;
  user: string;
  url: string;
  workshop: string;
  environment: string;
  namespace: string;
  fullUrl: string;
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
