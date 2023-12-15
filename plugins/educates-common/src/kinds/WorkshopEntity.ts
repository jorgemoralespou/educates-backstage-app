import { Entity } from '@backstage/catalog-model';

// TODO: Move this to an educates model package
// See how to export this for consumption in the frontend: https://github.com/backstage/backstage/blob/79bff053f1d68c35d49304af1ec834f1498bc6ce/packages/catalog-model/src/kinds/index.ts
export interface WorkshopEntityV1alpha1 extends Entity {
  apiVersion: 'educates.dev/v1alpha1' | 'educates.dev/v1beta1';
  kind: 'Workshop';
  spec: {
    type: string;
    lifecycle: string;
    owner: string;
    subcomponentOf?: string;
    providesApis?: string[];
    consumesApis?: string[];
    dependsOn?: string[];
    system?: string;
  };
}
