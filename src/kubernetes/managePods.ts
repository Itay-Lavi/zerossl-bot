import { deploymentSelectors } from "../config";
import { deletePodsByLabelSelector } from "../data/networkService";


export async function restartPodByLabelSelector() {
    try {
     const selectors = deploymentSelectors!.split(',');
     for (const selector of selectors) {
        await deletePodsByLabelSelector(selector);
        console.log(selector + ' pods deleted successfully');
     }
    } catch (err) {
      console.error(`Error restarting pods: ${err}`);
    }
  }