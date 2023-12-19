// import { UrlReader } from '@backstage/backend-common';
import {
  processingResult,
  CatalogProcessor,
  CatalogProcessorEmit,
  CatalogProcessorCache,
} from '@backstage/plugin-catalog-node';

import { LocationSpec } from '@backstage/plugin-catalog-common';
import {
  Entity,
  RELATION_HAS_PART,
  RELATION_OWNED_BY,
  RELATION_OWNER_OF,
  RELATION_PART_OF,
  getCompoundEntityRef,
  parseEntityRef,
} from '@backstage/catalog-model';
import { Logger } from 'winston';
import {
  TrainingPortalEntity,
  WorkshopEntity,
  RELATION_INCLUDES_WORKSHOP,
  RELATION_WORKSHOP_INCLUDED_BY,
} from '@internal/plugin-educates-common';

export class EducatesEntitiesProcessor implements CatalogProcessor {
  constructor(
    // private readonly reader: UrlReader,
    private readonly logger: Logger,
  ) {}
  getProcessorName(): string {
    return 'EducatesEntitiesProcessor';
  }

  // Run after preProcess
  /**
   * We set only to validate educates entities
   *
   * @param entity
   * @returns
   */
  async validateEntityKind(entity: Entity): Promise<boolean> {
    // TODO: Consider using builtin validations additionally
    // like here: https://github.com/backstage/backstage/blob/79bff053f1d68c35d49304af1ec834f1498bc6ce/plugins/catalog-backend/src/modules/core/BuiltinKindsEntityProcessor.ts#L60-L84
    // and here: https://github.com/backstage/backstage/tree/79bff053f1d68c35d49304af1ec834f1498bc6ce/packages/catalog-model/src/validation
    if (entity.apiVersion !== 'educates.dev/v1alpha1') {
      return false;
    }
    return true;
  }

  // Run after validateEntityKind
  /**
   * Only educates entities are processed
   *
   * @param entity
   * @param _location
   * @param emit
   * @param _cache
   * @returns
   */
  async postProcessEntity(
    entity: Entity,
    _location: LocationSpec,
    emit: CatalogProcessorEmit,
    _cache: CatalogProcessorCache,
  ): Promise<Entity> {
    const selfRef = getCompoundEntityRef(entity);

    /*
     * Utilities
     */

    function doEmit(
      targets: string | string[] | undefined,
      context: { defaultKind?: string; defaultNamespace: string },
      outgoingRelation: string,
      incomingRelation: string,
    ): void {
      if (!targets) {
        return;
      }
      for (const target of [targets].flat()) {
        const targetRef = parseEntityRef(target, context);
        emit(
          processingResult.relation({
            source: selfRef,
            type: outgoingRelation,
            target: {
              kind: targetRef.kind,
              namespace: targetRef.namespace,
              name: targetRef.name,
            },
          }),
        );
        emit(
          processingResult.relation({
            source: {
              kind: targetRef.kind,
              namespace: targetRef.namespace,
              name: targetRef.name,
            },
            type: incomingRelation,
            target: selfRef,
          }),
        );
      }
    }

    if (entity.kind === 'TrainingPortal') {
      const component = entity as TrainingPortalEntity;
      doEmit(
        component.spec.owner,
        { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
        RELATION_OWNED_BY,
        RELATION_OWNER_OF,
      );
      // doEmit(
      //   component.spec.subcomponentOf,
      //   { defaultKind: 'Component', defaultNamespace: selfRef.namespace },
      //   RELATION_PART_OF,
      //   RELATION_HAS_PART,
      // );
      // doEmit(
      //   component.spec.providesApis,
      //   { defaultKind: 'API', defaultNamespace: selfRef.namespace },
      //   RELATION_PROVIDES_API,
      //   RELATION_API_PROVIDED_BY,
      // );
      // doEmit(
      //   component.spec.consumesApis,
      //   { defaultKind: 'API', defaultNamespace: selfRef.namespace },
      //   RELATION_CONSUMES_API,
      //   RELATION_API_CONSUMED_BY,
      // );
      // doEmit(
      //   component.spec.dependsOn,
      //   { defaultNamespace: selfRef.namespace },
      //   RELATION_DEPENDS_ON,
      //   RELATION_DEPENDENCY_OF,
      // );
      doEmit(
        component.spec.system,
        { defaultKind: 'System', defaultNamespace: selfRef.namespace },
        RELATION_PART_OF,
        RELATION_HAS_PART,
      );
      doEmit(
        component.spec.includedWorkshops,
        { defaultKind: 'Workshop', defaultNamespace: selfRef.namespace },
        RELATION_WORKSHOP_INCLUDED_BY,
        RELATION_INCLUDES_WORKSHOP,
      );
      this.logger.info('Processed TrainingPortal');
    }

    if (entity.kind === 'Workshop') {
      const component = entity as WorkshopEntity;
      doEmit(
        component.spec.owner,
        { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
        RELATION_OWNED_BY,
        RELATION_OWNER_OF,
      );
      // doEmit(
      //   component.spec.subcomponentOf,
      //   { defaultKind: 'Component', defaultNamespace: selfRef.namespace },
      //   RELATION_PART_OF,
      //   RELATION_HAS_PART,
      // );
      // doEmit(
      //   component.spec.providesApis,
      //   { defaultKind: 'API', defaultNamespace: selfRef.namespace },
      //   RELATION_PROVIDES_API,
      //   RELATION_API_PROVIDED_BY,
      // );
      // doEmit(
      //   component.spec.consumesApis,
      //   { defaultKind: 'API', defaultNamespace: selfRef.namespace },
      //   RELATION_CONSUMES_API,
      //   RELATION_API_CONSUMED_BY,
      // );
      // doEmit(
      //   component.spec.dependsOn,
      //   { defaultNamespace: selfRef.namespace },
      //   RELATION_DEPENDS_ON,
      //   RELATION_DEPENDENCY_OF,
      // );
      doEmit(
        component.spec.system,
        { defaultKind: 'System', defaultNamespace: selfRef.namespace },
        RELATION_PART_OF,
        RELATION_HAS_PART,
      );
      doEmit(
        component.spec.trainingPortals,
        { defaultKind: 'TrainingPortal', defaultNamespace: selfRef.namespace },
        RELATION_INCLUDES_WORKSHOP,
        RELATION_WORKSHOP_INCLUDED_BY,
      );
      this.logger.info('Processed Workshop');
    }

    return entity;
  }
}
