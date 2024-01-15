import { Entity } from '@backstage/catalog-model';
import schema from '../schema/TrainingPortalEntity.v1beta1.schema.json';
import { trainingPortalSchemaValidator } from '../validation';

// TODO: Move this to an educates model package
export interface TrainingPortalEntityV1beta1 extends Entity {
  apiVersion: 'educates.dev/v1beta1';
  kind: 'TrainingPortal';
  spec: {
    lifecycle: string;
    owner: string;
    system?: string;
    includedWorkshops?: string[];
  };
}

export const trainingPortalEntityV1beta1Validator =
  trainingPortalSchemaValidator(schema);
