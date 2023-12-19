import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-catalog-backend-module-scaffolder-entity-model';
import {
  GithubEntityProvider,
  GithubOrgEntityProvider,
} from '@backstage/plugin-catalog-backend-module-github';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import {
  // EducatesEntityProvider,
  EducatesEntitiesProcessor,
} from '@internal/plugin-educates-backend';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.addProcessor(new ScaffolderEntitiesProcessor());
  builder.addProcessor(new EducatesEntitiesProcessor(env.reader, env.logger));

  builder.addEntityProvider(
    GithubEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      // optional: alternatively, use scheduler with schedule defined in app-config.yaml
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 30 },
        timeout: { minutes: 3 },
      }),
      // optional: alternatively, use schedule
      scheduler: env.scheduler,
    }),
  );

  // The org URL below needs to match a configured integrations.github entry
  // specified in your app-config.
  builder.addEntityProvider(
    GithubOrgEntityProvider.fromConfig(env.config, {
      id: 'production',
      orgUrl: 'https://github.com/educates',
      logger: env.logger,
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 60 },
        timeout: { minutes: 15 },
      }),
      // We can add UserTranformer and TeamTransformer if we want Users and Teams to be modified
      // when added to the catalog: https://backstage.io/docs/integrations/github/org/#custom-transformers
    }),
  );

  // const educatesProvider = new TrainingPortalEntityProvider({
  //   logger: env.logger,
  //   topics: ['educates'],
  //   reader: env.reader,
  // });
  // builder.addEntityProvider(educatesProvider);

  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}
