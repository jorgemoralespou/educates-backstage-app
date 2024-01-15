import { Entity } from '@backstage/catalog-model';
import schema from '../schema/WorkshopEntity.v1beta1.schema.json';
import { workshopSchemaValidator } from '../validation';

// TODO: Move this to an educates model package
// See how to export this for consumption in the frontend: https://github.com/backstage/backstage/blob/79bff053f1d68c35d49304af1ec834f1498bc6ce/packages/catalog-model/src/kinds/index.ts
export interface WorkshopEntityV1beta1 extends Entity {
  apiVersion: 'educates.dev/v1beta1';
  kind: 'Workshop';
  spec: {
    lifecycle: string;
    owner: string;
    system?: string;
  };
}

export const workshopEntityV1beta1Validator = workshopSchemaValidator(schema);
