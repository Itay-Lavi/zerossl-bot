import { KubeConfig, CoreV1Api, V1Service } from '@kubernetes/client-node';

class KubernetesService {
  private static instance: KubernetesService;
  private k8sApi: CoreV1Api;

  private constructor() {
    const kc = new KubeConfig();
    kc.loadFromDefault();
    this.k8sApi = kc.makeApiClient(CoreV1Api);
  }

  public static getInstance(): KubernetesService {
    if (!KubernetesService.instance) {
      KubernetesService.instance = new KubernetesService();
    }
    return KubernetesService.instance;
  }

  async deletePodsByLabelSelector(labelSelector: string, namespace: string = 'default') {
    await this.k8sApi.deleteCollectionNamespacedPod(namespace, undefined, undefined, undefined,undefined,undefined,labelSelector);
  }

  async getServiceByName(serviceName: string, namespace: string = 'default') {
    return await this.k8sApi.readNamespacedService(serviceName, namespace);
  }

  async deleteServiceByName(serviceName: string, namespace: string = 'default') {
    await this.k8sApi.deleteNamespacedService(serviceName, namespace);
  }

  async applyService(serviceFile: V1Service, namespace: string = 'default') {
    await this.k8sApi.createNamespacedService(namespace, serviceFile);
  }
}


export default KubernetesService;