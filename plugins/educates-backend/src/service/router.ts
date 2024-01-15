import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { Config } from '@backstage/config';
import { EducatesBackendApiClient } from '../api/EducatesBackendApi.client';

export interface RouterOptions {
  logger: Logger;
  identity: IdentityApi;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, identity, config } = options;

  const EducatesBackendApiRef = new EducatesBackendApiClient({
    logger: options.logger,
  });

  const router = Router();
  router.use(express.json());

  router.post('/catalog/:portal', async (req, res) => {
    const portal = req.params.portal;
    const params = req.body;
    const userIdentity = await identity.getIdentity({ request: req });

    logger.info(`portal ${portal} -  params: ${JSON.stringify(params)}`);
    logger.info(
      `req: ${req.method} ${req.url} ${userIdentity} ${JSON.stringify(
        req.body,
      )}`,
    );
    const response = await EducatesBackendApiRef.catalog(params);
    res.json(response);
  });
  router.get('/catalog/:portal', async (req, res) => {
    const portal = req.params.portal;
    const params = req.body;
    const userIdentity = await identity.getIdentity({ request: req });

    logger.info(`portal ${portal} -  params: ${JSON.stringify(params)}`);
    logger.info(
      `req: ${req.method} ${req.url} ${userIdentity} ${JSON.stringify(
        req.body,
      )}`,
    );
    const response = await EducatesBackendApiRef.catalog(params);
    res.json(response);
  });

  router.post('/execute/:portal', async (req, res) => {
    // const portal = req.params.portal;
    const params = req.body;
    const userIdentity = await identity.getIdentity({ request: req });

    logger.info(
      `req: ${req.method} ${req.url} ${userIdentity} ${JSON.stringify(
        req.body,
      )}`,
    );
    const response = await EducatesBackendApiRef.execute(params);
    res.json(response);
  });

  router.get('/execute/:environment', async (req, res) => {
    // const portal = req.params.environment;
    const params = req.body;
    const userIdentity = await identity.getIdentity({ request: req });

    logger.info(
      `req: ${req.method} ${req.url} ${userIdentity} ${JSON.stringify(
        req.body,
      )}`,
    );
    const response = await EducatesBackendApiRef.execute(params);
    res.json(response);
  });

  router.get('/health', async (request, response) => {
    const userIdentity = await identity.getIdentity({ request: request });
    logger.info(`PONG!${userIdentity}`);
    response.json({ status: `ok ${userIdentity}` }); // Fixed the string concatenation
  });

  // router.get('/config', async (_request, response) => {
  //   logger.info(`Calling config`);
  //   config
  //     .getConfigArray(`educates.portals`)
  //     .forEach((portalConfig: Config) => {
  //       logger.info(`Portal name in config: ${portalConfig.getString('name')}`);
  //       logger.info(`Portal url in config: ${portalConfig.getString('url')}`);
  //     });
  //   response.json({ config: `ok` }); // Fixed the string concatenation
  // });

  router.use(errorHandler());
  return router;
}
