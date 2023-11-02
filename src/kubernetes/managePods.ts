import { deploymentSelectors } from '../config';
import KubernetesService from '../data/networkService';

export async function restartPodsByLabelSelector() {
  try {
    const selectors = deploymentSelectors!.split(',');
    for (const selector of selectors) {
      await KubernetesService.getInstance().deletePodsByLabelSelector(selector);
      console.log(selector + ' pod deleted successfully');
    }
  } catch (err: Error | any) {
    console.error(`Error restarting pods: ${err.message}`);
  }
}
