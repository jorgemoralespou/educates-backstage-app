import { UrlReader } from '@backstage/backend-common';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { EventParams, EventSubscriber } from '@backstage/plugin-events-node';
import { Logger } from 'winston';
import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  Entity,
} from '@backstage/catalog-model';

export class EducatesEntitiesProvider
  implements EntityProvider, EventSubscriber
{
  private readonly logger: Logger;
  private readonly topics: string[];

  // private readonly reader: UrlReader;
  private connection?: EntityProviderConnection;

  constructor(opts: { logger: Logger; topics: string[]; reader: UrlReader }) {
    const { logger, topics } = opts;
    this.logger = logger;
    this.topics = topics;
    // this.reader = reader;
  }

  /** [2] */
  getProviderName(): string {
    return EducatesEntitiesProvider.name;
  }

  /** [3] */
  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
  }

  async onEvent(params: EventParams): Promise<void> {
    this.logger.info(
      `onEvent: topic=${params.topic}, metadata=${JSON.stringify(
        params.metadata,
      )}, payload=${JSON.stringify(params.eventPayload)}`,
    );

    if (!this.connection) {
      throw new Error('Not initialized');
    }

    // Get data from training portal

    // const response = await this.reader.readUrl(
    //   `https://frobs-sss.example.com/data`,
    // );
    // const data = JSON.parse(await response.buffer()).toString();

    /** [5] */ // Parse data and convert to entities
    const entities: Entity[] = trainingportalToEntities(null);

    /** [6] */ // Apply mutations to catalog
    await this.connection.applyMutation({
      type: 'full',
      entities: entities.map(entity => ({
        entity,
        locationKey: `educates-provider:sss`,
      })),
    });
  }

  supportsEventTopics(): string[] {
    return this.topics;
  }
}
function trainingportalToEntities(_data: any): Entity[] {
  const result: Entity[] = [];
  const count = 10;

  for (let i = 1; i <= count; ++i) {
    result.push({
      apiVersion: 'educates.dev/v1alpha1',
      kind: 'Workshop',
      metadata: {
        annotations: {
          [ANNOTATION_ORIGIN_LOCATION]: 'url:http://example.com/load-testing',
          [ANNOTATION_LOCATION]: 'url:http://example.com/load-testing',
        },
        namespace: 'load-test',
        name: `load-test-${i}`,
      },
      spec: {
        type: 'load-test-data',
        owner: 'me',
        lifecycle: 'experimental',
      },
    });
  }

  return result;
}
