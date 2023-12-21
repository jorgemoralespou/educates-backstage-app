import { useApi } from '@backstage/core-plugin-api';
import {
  kubernetesApiRef,
  kubernetesProxyApiRef,
} from '@backstage/plugin-kubernetes';
import { EducatesKubernetesApi } from './EducatesKubernetesApi';
import { TrainingPortal } from './EducatesKubernetesApi.model';

export class EducatesKubernetesApiClient implements EducatesKubernetesApi {
  CLUSTER_NAME = 'local'; // use a known cluster name

  kubernetesApi = useApi(kubernetesApiRef);
  kubernetesProxyApi = useApi(kubernetesProxyApiRef);

  private async handleText(response: Response): Promise<string> {
    if (!response.ok) {
      const payload = await response.text();
      let message;
      switch (response.status) {
        default:
          message = `Proxy request failed with ${response.status} ${response.statusText}, ${payload}`;
      }
      throw new Error(message);
    }

    return await response.text();
  }

  private async handleJson(response: Response): Promise<any> {
    if (!response.ok) {
      const payload = await response.text();
      let message = `Request failed with ${response.status} ${response.statusText}, ${payload}`;
      switch (response.status) {
        case 404:
          message = `Proxy request failed with ${response.status} ${response.statusText}, ${payload}`;
          break;
        default:
          message = `Request failed with ${response.status} ${response.statusText}, ${payload}`;
      }
      throw new Error(message);
    }

    return await response.json();
  }

  async portal(name: string): Promise<TrainingPortal> {
    // const params = new URLSearchParams({
    //   container: containerName,
    // });
    // if (previous) {
    //   params.append('previous', '');
    // }
    try {
      const resp = await this.kubernetesApi.proxy({
        clusterName: this.CLUSTER_NAME,
        path: `/apis/training.educates.dev/v1beta1/trainingportals/${name}`,
        init: {
          method: 'GET',
        },
      });
      return await this.handleJson(resp);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    return {} as TrainingPortal;
  }
}
