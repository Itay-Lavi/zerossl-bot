import { V1Service, loadYaml } from '@kubernetes/client-node';

import KubernetesService from '../data/networkService';

type servicePorts = {
  name: string;
  protocol: string;
  port: number;
  targetPort: number;
  nodePort: number;
}[];

export async function replaceServices({
  deleteServiceObject,
  addServiceObject,
}: {
  deleteServiceObject: V1Service;
  addServiceObject: V1Service;
}): Promise<void> {
  try {
    await deleteService(deleteServiceObject);
  } catch (err) {
    console.error(`Error deleting service: ${err}`);
  }
  try {
    await addService(addServiceObject);
  } catch (err) {
    console.error(`Error adding service: ${err}`);
  }
}

export function stringToService(serviceString: string): V1Service {
  return loadYaml(serviceString);
}

export async function getService(serviceName: string): Promise<V1Service> {
  try {
    const serviceBody = (
      await KubernetesService.getInstance().getServiceByName(serviceName)
    ).body as any;
    const appLabel = serviceBody.spec.selector.app;
    const ports: servicePorts = serviceBody.spec.ports.map(({port}: {port: number}) => {
      return {
        name: port === 443 ? 'https' : 'http',
        protocol: 'TCP',
        port: port,
        targetPort: port,
        nodePort: port,
      };
    });

    return createServiceObject({ serviceName, appLabel, ports });
  } catch (err) {
    throw new Error(`Error getting service: ${serviceName}`);
  }
}

async function addService(serviceObject: V1Service): Promise<void> {
  if (serviceObject && serviceObject.metadata?.name) {
    await KubernetesService.getInstance().applyService(serviceObject);
    console.log(`Applied service: ${serviceObject.metadata?.name}`);
  } else {
    console.error('Invalid service object or missing service name.');
  }
}

async function deleteService(serviceObject: V1Service): Promise<void> {
  if (serviceObject && serviceObject.metadata?.name) {
    await KubernetesService.getInstance().deleteServiceByName(
      serviceObject.metadata.name
    );
    console.log('Deleted service: ' + serviceObject.metadata.name);
  } else {
    console.error('Invalid service object or missing service name.');
  }
}

function createServiceObject({
  serviceName,
  appLabel,
  ports,
}: {
  serviceName: string;
  appLabel: string;
  ports: servicePorts;
}): V1Service {
  const serviceObj: V1Service = {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: serviceName,
    },
    spec: {
      selector: {
        app: appLabel,
      },
      type: 'LoadBalancer',
      ports: ports,
    },
  };
  return serviceObj;
}
