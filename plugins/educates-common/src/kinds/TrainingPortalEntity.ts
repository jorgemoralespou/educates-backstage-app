import { Entity } from '@backstage/catalog-model';

// TODO: Move this to an educates model package
export interface TrainingPortalEntityV1alpha1 extends Entity {
  apiVersion: 'educates.dev/v1alpha1' | 'educates.dev/v1beta1';
  kind: 'TrainingPortal';
  spec: {
    type: string;
    lifecycle: string;
    owner: string;
    includedWorkshops?: string[];
    system?: string;
  };
}
