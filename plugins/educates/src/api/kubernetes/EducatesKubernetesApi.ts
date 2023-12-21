import { createApiRef } from '@backstage/core-plugin-api';
import { TrainingPortal } from './EducatesKubernetesApi.model';

export interface EducatesKubernetesApi {
  portal: (name: string) => Promise<TrainingPortal>;
}

export const educatesKubernetesApiRef = createApiRef<EducatesKubernetesApi>({
  id: 'plugin.educates-kubernetes.service',
});
