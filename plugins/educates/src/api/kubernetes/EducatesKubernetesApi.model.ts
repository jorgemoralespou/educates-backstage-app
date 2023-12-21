export interface TrainingPortal {
  metadata: K8SMetadata;
  spec: TrainingPortalSpec;
  status: TrainingPortalStatus;
}

export interface TrainingPortalSpec {
  portal: TrainingPortalSpecPortal;
  workshops: TrainingPortalSpecWorkshop[];
}

export interface TrainingPortalSpecPortal {
  title: string;
}

export interface TrainingPortalSpecWorkshop {
  name: string;
}

export interface TrainingPortalStatus {
  educates: TrainingPortalStatusEducates;
}

export interface TrainingPortalStatusEducates {
  namespace: string;
  phase: string;
  url: string;
  clients: TrainingPortalStatusEducatesClients;
  credentials: TrainingPortalStatusEducatesCredentials;
}

export interface TrainingPortalStatusEducatesCredentials {
  admin: TrainingPortalCredentials;
  robot: TrainingPortalCredentials;
}

export interface TrainingPortalCredentials {
  username: string;
  password: string;
}

export interface TrainingPortalStatusEducatesClients {
  robot: TrainingPortalClients;
}

export interface TrainingPortalClients {
  id: string;
  secret: string;
}

export interface Workshop {
  metadata: K8SMetadata;
  spec: WorkshopSpec;
}

export interface WorkshopSpec {
  description: string;
  duration: string;
  title: string;
  version: string;
  // workshop
  // session
}

export interface K8SMetadata {
  name: string;
  namespace: string;
  labels: Map<string, string>;
  annotations: Map<string, string>;
}
