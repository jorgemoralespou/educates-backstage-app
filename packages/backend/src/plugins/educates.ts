import { createRouter } from '@internal/plugin-educates-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
// import { KubernetesClientBasedFetcher } from '@backstage/plugin-kubernetes-backend';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  // Here is where you will add all of the required initialization code that
  // your backend plugin needs to be able to start!

  // From: https://github.com/backstage/backstage/blob/master/plugins/kubernetes-backend/src/service/KubernetesBuilder.ts#L265C1-L272C1
  // const fetcher = new KubernetesClientBasedFetcher({
  //   logger: env.logger,
  // });

  //   return this.fetcher;
  // }

  // The env contains a lot of goodies, but our router currently only
  // needs a logger
  return await createRouter({
    logger: env.logger,
    identity: env.identity,
    config: env.config,
  });
}
