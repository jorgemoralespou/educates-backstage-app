import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { educatesRestApiRef } from './api/EducatesRestApi';
import { EducatesRestApiClient } from './api/EducatesRestApi.client';
import { educatesCatalogApiRef } from './api/EducatesCatalogApi';
import { EducatesCatalogApiClient } from './api/EducatesCatalogApi.client';

export const educatesPlugin = createPlugin({
  id: 'educates',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: educatesRestApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        identityApi: identityApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, identityApi, fetchApi }) =>
        new EducatesRestApiClient({ discoveryApi, identityApi, fetchApi }),
    }),
    createApiFactory({
      api: educatesCatalogApiRef,
      deps: {},
      factory: () => new EducatesCatalogApiClient(),
    }),
  ],
});

export const EducatesPage = educatesPlugin.provide(
  createRoutableExtension({
    name: 'EducatesPage',
    component: () =>
      import('./components/WorkshopCatalogPage').then(
        m => m.WorkshopCatalogPage,
      ),
    mountPoint: rootRouteRef,
  }),
);
