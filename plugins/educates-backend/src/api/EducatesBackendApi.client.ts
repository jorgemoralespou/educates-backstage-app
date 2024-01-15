import {
  CatalogRequestParams,
  EducatesBackendApiCatalogResponse,
  EducatesBackendApiExecuteResponse,
  EducatesBackendApiUserSessionsResponse,
  EducatesTokenDetails,
  ExecuteRequestParams,
  TrainingPortalDetails,
} from './EducatesBackendApi.model';
import { EducatesBackendApi } from './EducatesBackendApi';
import { Logger } from 'winston';
import { Agent, setGlobalDispatcher } from 'undici';

interface LoginFetchLogoutRequest {
  url: string;
  client: {
    id: string;
    secret: string;
  };
  credentials: {
    username: string;
    password: string;
  };
  token: string;
}

export class EducatesBackendApiClient implements EducatesBackendApi {
  private readonly logger: Logger;

  constructor(options: { logger: Logger }) {
    // this.catalog = this.catalog.bind(this);
    this.logger = options.logger;

    // This is added so that we can use self signed certs or certs signed by unknown CA's while developing
    setGlobalDispatcher(
      new Agent({
        connect: {
          rejectUnauthorized: false,
        },
      }),
    );
  }

  private async login(params: LoginFetchLogoutRequest): Promise<string> {
    const { url, client, credentials } = params;
    // const { id, secret } = portalDetails.clients.robot;
    // const { username, password } = portalDetails.credentials.robot;

    const token = `Basic ${btoa(`${client.id}:${client.secret}`)}`;
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/x-www-form-urlencoded');
    requestHeaders.set('Authorization', `${token}`);

    const resp = await fetch(`${url}/oauth2/token/`, {
      method: 'POST',
      headers: requestHeaders,
      body: `grant_type=password&username=${credentials.username}&password=${credentials.password}`,
    }).then(r => r.json());
    return resp.access_token;
  }

  private async logout(params: LoginFetchLogoutRequest): Promise<void> {
    const token = `Basic ${btoa(
      `${params.client.id}:${params.client.secret}`,
    )}`;
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/x-www-form-urlencoded');
    requestHeaders.set('Authorization', `${token}`);

    await fetch(`${params.url}/oauth2/revoke-token/`, {
      method: 'POST',
      headers: requestHeaders,
      body: `token=${params.token}&client_id=${params.client.id}&client_secret=${params.client.secret}`,
    });
    return;
  }

  private async loginFetchLogout<T = any>(
    params: LoginFetchLogoutRequest,
    input: string,
    init?: RequestInit,
  ): Promise<T> {
    const apiToken = await this.login(params);
    params.token = apiToken;
    const requestHeaders: HeadersInit = new Headers();
    // requestHeaders.set('Content-Type', 'application/x-www-form-urlencoded');
    requestHeaders.set('Authorization', `Bearer ${apiToken}`);

    const resp = await fetch(`${params.url}${input}`, {
      method: init?.method,
      headers: requestHeaders,
      body: init?.body,
    })
      .then(r => r.json())
      .finally(() => {
        this.logout(params);
      });
    return resp;
  }

  private async internalCatalog(
    params: LoginFetchLogoutRequest,
  ): Promise<EducatesBackendApiCatalogResponse> {
    return await this.loginFetchLogout<EducatesBackendApiCatalogResponse>(
      params,
      '/workshops/catalog/environments/',
      {
        method: 'GET',
      },
    );
  }

  private async internalExecute(
    params: LoginFetchLogoutRequest,
    environment: string,
    user?: string,
  ): Promise<string> {
    const userParam = user !== undefined ? `&user=${user}` : '';
    const resp = await this.loginFetchLogout<EducatesBackendApiExecuteResponse>(
      params,
      `/workshops/environment/${environment}/request/?index_url=https://localhost:3000/${userParam}`,
      {
        method: 'GET',
      },
    );
    return `${params.url}/${resp.url}`;
  }

  // async getActiveSessions(
  //   portalDetails: TrainingPortalDetails,
  //   user?: string | undefined,
  // ): Promise<EducatesBackendApiUserSessionsResponse> {
  //   const resp =
  //     await this.loginFetchLogout<EducatesBackendApiUserSessionsResponse>(
  //       portalDetails,
  //       `/user/${user}/sessions/`,
  //       {
  //         method: 'GET',
  //       },
  //     );
  //   return resp;
  // }

  async catalog(
    params: CatalogRequestParams,
  ): Promise<EducatesBackendApiCatalogResponse> {
    const req = {
      url: params.url,
      client: {
        id: params.clientId,
        secret: params.clientSecret,
      },
      credentials: {
        username: params.username,
        password: params.password,
      },
      token: '',
    };

    const catalog = await this.internalCatalog(req);
    return catalog;
    // TODO: Retrieve the catalog from the backend educates entity
    // return new json with a response
    // return {
    //   portal: {
    //     displayName: 'Backstage Educates Plugin',
    //     description: 'Backstage Educates Plugin',
    //     logo: '',
    //     name: 'backstage-educates-plugin',
    //     url: 'https://backstage-educates-plugin-ui.kind.tanzu-devs.com',
    //   },
    //   environments: [
    //     {
    //       name: 'backstage-educates-plugin-w01',
    //       state: 'RUNNING',
    //       workshop: {
    //         name: 'lab-k8s-fundamentals',
    //         title: 'Kubernetes Fundamentals',
    //         description: 'An interactive workshop on Kubernetes fundamentals.',
    //         vendor: '',
    //         authors: [],
    //         difficulty: '',
    //         duration: '',
    //         tags: [],
    //         labels: {},
    //         logo: '',
    //         url: '',
    //       },
    //       duration: 3600,
    //       capacity: 5,
    //       reserved: 0,
    //       allocated: 0,
    //       available: 0,
    //     },
    //     {
    //       name: 'backstage-educates-plugin-w02',
    //       available: 'RUNNING',
    //       workshop: {
    //         name: 'lab-container-basics',
    //         title: 'Container Basics',
    //         description:
    //           'An interactive workshop on running applications in containers.',
    //         vendor: '',
    //         authors: [],
    //         difficulty: '',
    //         duration: '',
    //         tags: [],
    //         labels: {},
    //         logo: '',
    //         url: '',
    //       },
    //       duration: 3600,
    //       capacity: 5,
    //       reserved: 0,
    //       allocated: 0,
    //       available: 0,
    //     },
    //     {
    //       name: 'backstage-educates-plugin-w03',
    //       available: 'RUNNING',
    //       workshop: {
    //         name: 'lab-admin-vcluster',
    //         title: 'Test of admin virtual cluster',
    //         description:
    //           'Test of shared virtual cluster providing full admin access.',
    //         vendor: 'educates.dev',
    //         authors: ['Jorge Morales'],
    //         difficulty: 'beginner',
    //         duration: '60m',
    //         tags: ['vcluster', 'samples'],
    //         labels: {},
    //         logo: '',
    //         url: 'https://github.com/educates/labs-vcluster-testing',
    //       },
    //       duration: 3600,
    //       capacity: 5,
    //       reserved: 0,
    //       allocated: 0,
    //       available: 0,
    //     },
    //     {
    //       name: 'backstage-educates-plugin-w04',
    //       available: 'RUNNING',
    //       workshop: {
    //         name: 'lab-builtin-vcluster',
    //         title: 'Test of builtin virtual cluster',
    //         description:
    //           'Test of using builtin support for creating a virtual cluster.',
    //         vendor: '',
    //         authors: [],
    //         difficulty: '',
    //         duration: '',
    //         tags: [],
    //         labels: {},
    //         logo: '',
    //         url: '',
    //       },
    //       duration: 3600,
    //       capacity: 5,
    //       reserved: 0,
    //       allocated: 0,
    //       available: 0,
    //     },
    //     {
    //       name: 'backstage-educates-plugin-w05',
    //       available: 'RUNNING',
    //       workshop: {
    //         name: 'lab-command-vcluster',
    //         title: 'Test of using the vcluster command',
    //         description:
    //           'Test of creating a virtual cluster using the vcluster CLI.',
    //         vendor: '',
    //         authors: [],
    //         difficulty: '',
    //         duration: '',
    //         tags: [],
    //         labels: {},
    //         logo: '',
    //         url: '',
    //       },
    //       duration: 3600,
    //       capacity: 5,
    //       reserved: 0,
    //       allocated: 0,
    //       available: 0,
    //     },
    //     {
    //       name: 'backstage-educates-plugin-w06',
    //       available: 'RUNNING',
    //       workshop: {
    //         name: 'lab-contour-vcluster',
    //         title: 'Test of Contour with a virtual cluster',
    //         description: 'Test of installing Contour into a virtual cluster.',
    //         vendor: '',
    //         authors: [],
    //         difficulty: '',
    //         duration: '',
    //         tags: [],
    //         labels: {},
    //         logo: '',
    //         url: '',
    //       },
    //       duration: 0,
    //       capacity: 5,
    //       reserved: 0,
    //       allocated: 0,
    //       available: 0,
    //     },
    //     {
    //       name: 'backstage-educates-plugin-w07',
    //       available: 'RUNNING',
    //       workshop: {
    //         name: 'lab-remote-cluster',
    //         title: 'Test of using a remote cluster',
    //         description:
    //           'Test of using remote cluster and single namespace per session.',
    //         vendor: '',
    //         authors: [],
    //         difficulty: '',
    //         duration: '',
    //         tags: [],
    //         labels: {},
    //         logo: '',
    //         url: '',
    //       },
    //       duration: 0,
    //       capacity: 5,
    //       reserved: 0,
    //       allocated: 0,
    //       available: 0,
    //     },
    //     {
    //       name: 'backstage-educates-plugin-w08',
    //       available: 'RUNNING',
    //       workshop: {
    //         name: 'lab-setup-vcluster',
    //         title: 'Test of setting up a virtual cluster',
    //         description:
    //           'Test of how to prepopulate a virtual cluster with resources.',
    //         vendor: '',
    //         authors: [],
    //         difficulty: '',
    //         duration: '',
    //         tags: [],
    //         labels: {},
    //         logo: '',
    //         url: '',
    //       },
    //       duration: 0,
    //       capacity: 5,
    //       reserved: 0,
    //       allocated: 0,
    //       available: 0,
    //     },
    //     {
    //       name: 'backstage-educates-plugin-w09',
    //       available: 'RUNNING',
    //       workshop: {
    //         name: 'lab-shared-vcluster',
    //         title: 'Test of shared virtual cluster',
    //         description:
    //           'Test of using shared virtual cluster and single namespace per session.',
    //         vendor: '',
    //         authors: [],
    //         difficulty: '',
    //         duration: '',
    //         tags: [],
    //         labels: {},
    //         logo: '',
    //         url: '',
    //       },
    //       duration: 600,
    //       capacity: 5,
    //       reserved: 0,
    //       allocated: 0,
    //       available: 0,
    //     },
    //   ],
    // };
  }

  async execute(params: ExecuteRequestParams): Promise<string> {
    // TODO: Retrieve the catalog from the backend educates entity
    const req = {
      url: params.url,
      client: {
        id: params.clientId,
        secret: params.clientSecret,
      },
      credentials: {
        username: params.username,
        password: params.password,
      },
      token: '',
    };

    const catalog = await this.internalExecute(
      req,
      params.environment,
      params.user,
    );
    return catalog;
    //    return 'https://educates-cli-ui.kind.tanzu-devs.com/workshops/session/lab-k8s-fundamentals/activate/?token=6UIW4D8Bhf0egVmsEKYlaOcTywrpQJGi&index_url=https%3A%2F%2Fhub.test%2F';
  }
}
