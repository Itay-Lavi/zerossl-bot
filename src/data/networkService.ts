import { KubeConfig, CoreV1Api } from '@kubernetes/client-node';


export async function deletePodsByLabelSelector(labelSelector: string, namespace: string = 'default') {
    const k8sApi = getK8sApi();
    
    await k8sApi.deleteCollectionNamespacedPod(namespace, undefined, undefined, undefined, labelSelector);
 }
 
function getK8sApi() {
    const kc = new KubeConfig();
    kc.loadFromDefault();
    const k8sApi = kc.makeApiClient(CoreV1Api);
    return k8sApi;
}
