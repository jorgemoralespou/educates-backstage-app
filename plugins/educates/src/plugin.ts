import {
  configApiRef,
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { educatesRestApiRef } from './api/rest/EducatesRestApi';
import { EducatesRestApiClient } from './api/rest/EducatesRestApi.client';
import { educatesCatalogApiRef } from './api/catalog/EducatesCatalogApi';
import { EducatesCatalogApiClient } from './api/catalog/EducatesCatalogApi.client';
import { educatesKubernetesApiRef } from './api/kubernetes/EducatesKubernetesApi';
import { EducatesKubernetesApiClient } from './api/kubernetes/EducatesKubernetesApi.client';

export const educatesPlugin = createPlugin({
  id: 'educates',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: educatesCatalogApiRef,
      deps: {},
      factory: () => new EducatesCatalogApiClient(),
    }),
    createApiFactory({
      api: educatesKubernetesApiRef,
      deps: {},
      factory: () => new EducatesKubernetesApiClient(),
    }),
    createApiFactory({
      api: educatesRestApiRef,
      deps: {
        fetchApi: fetchApiRef,
        educatesKubernetesApi: educatesKubernetesApiRef,
      },
      factory: ({ fetchApi, educatesKubernetesApi }) =>
        new EducatesRestApiClient({
          fetchApi,
          educatesKubernetesApi,
        }),
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
