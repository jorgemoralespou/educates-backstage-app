import {
  KindValidator,
  entityKindSchemaValidator,
} from '@backstage/catalog-model';

export function trainingPortalSchemaValidator(schema?: unknown): KindValidator {
  let validator: undefined | ((data: unknown) => any);
  return {
    async check(data) {
      if (!validator) {
        validator = entityKindSchemaValidator(schema);
      }
      return validator(data) === data;
    },
  };
}
