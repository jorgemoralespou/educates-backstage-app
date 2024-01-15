import {
  // configApiRef,
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  // fetchApiRef,
  // identityApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
// import { educatesRestApiRef } from './api/rest/EducatesRestApi';
// import { EducatesRestApiClient } from './api/rest/EducatesRestApi.client';
// import { educatesCatalogApiRef } from './api/catalog/EducatesCatalogApi';
// import { EducatesCatalogApiClient } from './api/catalog/EducatesCatalogApi.client';
// import { educatesKubernetesApiRef } from './api/kubernetes/EducatesKubernetesApi';
// import { EducatesKubernetesApiClient } from './api/kubernetes/EducatesKubernetesApi.client';
import { EducatesApiClient } from './api/educates/EducatesApi.client';
import { educatesApiRef } from './api';

export const educatesPlugin = createPlugin({
  id: 'educates',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    // createApiFactory({
    //   api: educatesCatalogApiRef,
    //   deps: {},
    //   factory: () => new EducatesCatalogApiClient(),
    // }),
    // createApiFactory({
    //   api: educatesKubernetesApiRef,
    //   deps: {},
    //   factory: () => new EducatesKubernetesApiClient(),
    // }),
    // createApiFactory({
    //   api: educatesRestApiRef,
    //   deps: {
    //     discoveryApi: discoveryApiRef,
    //   },
    //   factory: ({ discoveryApi }) =>
    //     new EducatesRestApiClient({
    //       discoveryApi,
    //     }),
    // }),
    createApiFactory({
      api: educatesApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
      },
      factory: ({ discoveryApi }) =>
        new EducatesApiClient({
          discoveryApi,
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
