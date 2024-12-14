import { KubeConfig, CustomObjectsApi } from "@kubernetes/client-node";
const kc = new KubeConfig();
kc.loadFromFile("/home/rauno/.kube/config");

// Kubernetes API kliendi loomine
export const customObjectsApi = kc.makeApiClient(CustomObjectsApi);
module.exports = { customObjectsApi };
