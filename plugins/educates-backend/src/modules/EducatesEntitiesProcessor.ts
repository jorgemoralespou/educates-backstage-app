import { UrlReader } from '@backstage/backend-common';
import {
  processingResult,
  CatalogProcessor,
  CatalogProcessorEmit,
  CatalogProcessorCache,
} from '@backstage/plugin-catalog-node';

import { identity, merge, pickBy } from 'lodash';
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
  trainingPortalEntityV1beta1Validator,
  workshopEntityV1beta1Validator,
} from '@internal/plugin-educates-common';
import {
  ANNOTATION_CLUSTERS,
  ANNOTATION_TRAININPORTAL,
  ANNOTATION_WORKSHOP,
} from '@internal/plugin-educates-common/src/entity/constants';

export class EducatesEntitiesProcessor implements CatalogProcessor {
  constructor(
    private readonly reader: UrlReader,
    private readonly logger: Logger,
  ) {}

  getProcessorName(): string {
    return 'EducatesEntitiesProcessor';
  }

  private readonly validators = [
    trainingPortalEntityV1beta1Validator,
    workshopEntityV1beta1Validator,
  ];

  async validateEntityKind(entity: Entity): Promise<boolean> {
    for (const validator of this.validators) {
      if (await validator.check(entity)) {
        return true;
      }
    }

    return false;
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

    if (entity.apiVersion === 'training.educates.dev/v1beta1') {
      if (entity.kind === 'TrainingPortal') {
        const component = entity as TrainingPortalEntity;

        doEmit(
          component.spec.owner,
          { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
          RELATION_OWNED_BY,
          RELATION_OWNER_OF,
        );
        doEmit(
          component.spec.system,
          { defaultKind: 'System', defaultNamespace: selfRef.namespace },
          RELATION_PART_OF,
          RELATION_HAS_PART,
        );
        doEmit(
          component.spec.includedWorkshops,
          { defaultKind: 'Workshop', defaultNamespace: selfRef.namespace },
          RELATION_INCLUDES_WORKSHOP,
          RELATION_WORKSHOP_INCLUDED_BY,
        );
        this.logger.info('Processed TrainingPortal');
        return this.findAndAnnotateTrainingPortalByName(component);
      }

      if (entity.kind === 'Workshop') {
        const component = entity as WorkshopEntity;
        doEmit(
          component.spec.owner,
          { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
          RELATION_OWNED_BY,
          RELATION_OWNER_OF,
        );
        doEmit(
          component.spec.system,
          { defaultKind: 'System', defaultNamespace: selfRef.namespace },
          RELATION_PART_OF,
          RELATION_HAS_PART,
        );
        this.logger.info('Processed Workshop');
        return this.findAndAnnotateWorkshopByName(component);
      }
    }
    return entity;
  }

  /**
   * For now we hardcode the annotations, as there's no way we can easily query Kubernetes from the
   * backend. We could use the KubernetesClientBasedFetcher, but that would require a lot of work to
   * get it to work with the backend.
   *
   * There's a tracking issue: https://github.com/backstage/backstage/issues/22198
   *
   * @param component
   */
  async findAndAnnotateTrainingPortalByName(
    entity: TrainingPortalEntity,
  ): TrainingPortalEntity {
    const name = entity.metadata.name;
    return merge(
      {
        metadata: {
          annotations: pickBy(
            {
              [ANNOTATION_CLUSTERS]: 'local',
              [ANNOTATION_TRAININPORTAL]: name,
              ['training.educates.dev/endpoint']:
                'https://backstage-educates-plugin-ui.kind.tanzu-devs.com',
              ['training.educates.dev/client-id']: 'application-id',
              ['training.educates.dev/client-secret']: 'top-secret',
              ['training.educates.dev/robot-username']: 'robot-user',
              ['training.educates.dev/robot-password']: 'top-secret',
            },
            identity,
          ),
        },
      },
      entity,
    );
  }

  async findAndAnnotateWorkshopByName(entity: WorkshopEntity): WorkshopEntity {
    const name = entity.metadata.name;
    return merge(
      {
        metadata: {
          annotations: pickBy(
            {
              [ANNOTATION_CLUSTERS]: 'local',
              [ANNOTATION_WORKSHOP]: name,
            },
            identity,
          ),
        },
      },
      entity,
    );
  }
}
