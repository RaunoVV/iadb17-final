import { Router } from "express";
import { HttpError, type KubernetesObject, PatchUtils, type V1ObjectMeta } from "@kubernetes/client-node";

import { customObjectsApi } from "../resources/k8s";
import { responseMessage } from "../index.ts";

import type { TWorkflow, TWorkflowSpec } from "shared/src/types/Workflow.ts";

export const workflowRouter = Router();

const group = "tinkerbell.org";
const version = "v1alpha1";
const namespace = "default";
const plural = "workflows";

interface k8sWorkflowObject extends KubernetesObject {
    metadata: V1ObjectMeta;
    spec: TWorkflowSpec;
}

const WorkflowFromK8sObject = (k8sObject: k8sWorkflowObject): TWorkflow => {
    return {
        id: k8sObject.metadata.name,
        uid: k8sObject.metadata.uid,
        name: k8sObject.metadata.name ?? "",
        creationTimestamp: k8sObject.metadata.creationTimestamp,
        spec: k8sObject.spec,
    };
};
workflowRouter.get("/workflow", async (req, res) => {
    try {
        // Define custom resource parameters

        // List custom resources
        const k8sWorkflowList = await customObjectsApi.listNamespacedCustomObject(group, version, namespace, plural);

        const workflowList = new Array<TWorkflow>();

        for (const item of (k8sWorkflowList.body as any).items as k8sWorkflowObject[]) {
            workflowList.push(WorkflowFromK8sObject(item));
        }
        res.header("Content-Range", workflowList.length.toString());
        res.header("Content-Type", "application/json");
        res.json(workflowList);
    } catch (error) {
        console.error("Error:", error);
        if (error instanceof HttpError) {
            console.error("Error:", error);
            res.status(error.statusCode ?? 500).send(responseMessage(error.body.statusCode, error.body.message));
        }
    }
});
workflowRouter.get("/workflow/:workflowName", async (req, res) => {
    try {
        // List custom resources
        const k8sWorkflow = await customObjectsApi.getNamespacedCustomObject(
            group,
            version,
            namespace,
            plural,
            req.params.workflowName,
        );

        const wf = WorkflowFromK8sObject(k8sWorkflow.body as k8sWorkflowObject);

        res.header("Content-Type", "application/json");
        res.json(wf);
    } catch (error) {
        console.error("Error:", error);
        if (error instanceof HttpError) {
            console.error("Error:", error);
            res.status(error.statusCode ?? 500).send(responseMessage(error.body.statusCode, error.body.message));
        }
    }
});
workflowRouter.put("/workflow/:workflowName", async (req, res) => {
    try {
        // Define custom resource parameters

        const patch = [
            {
                op: "replace",
                path: "/spec",
                value: req.body.spec,
            },
        ];
        const options = {
            headers: {
                "Content-type": PatchUtils.PATCH_FORMAT_JSON_PATCH,
            },
        };
        const { body: responseWf } = (await customObjectsApi.patchNamespacedCustomObject(
            group,
            version,
            namespace,
            plural,
            req.params.workflowName,
            patch,
            undefined,
            undefined,
            undefined,
            options,
        )) as { body: k8sWorkflowObject };
        const wf = WorkflowFromK8sObject(responseWf);
        res.status(200).send(wf);
    } catch (error) {
        console.error("Error:", error);
        if (error instanceof HttpError) {
            console.error("Error:", error);
            res.status(error.statusCode ?? 500).send(responseMessage(error.body.statusCode, error.body.message));
        }
    }
});
workflowRouter.post("/workflow", async (req, res) => {
    try {
        // Define custom resource parameters

        const wfObject = {
            apiVersion: `${group}/${version}`,
            kind: "Workflow",
            metadata: {
                name: req.body.name,
                namespace: "default",
            },
            spec: req.body.spec,
        };

        const options = {
            headers: {
                "Content-type": "application/json",
            },
        };
        await customObjectsApi
            .createNamespacedCustomObject(
                group,
                version,
                namespace,
                plural,
                wfObject,
                undefined,
                undefined,
                undefined,
                options,
            )
            .then((result) => {
                const wf = WorkflowFromK8sObject(result.body as k8sWorkflowObject);
                console.log(wf);

                res.status(200).send(wf);
            })
            .catch((reason) => {
                console.error("Error:", reason);
                res.status(reason.statusCode).send(responseMessage(reason.statusCode, reason.body.message));
            });
    } catch (error) {
        console.error("Error:", error);
        if (error instanceof HttpError) {
            console.error("Error:", error);
            res.status(error.statusCode ?? 500).send(responseMessage(error.body.statusCode, error.body.message));
        }
    }
});
workflowRouter.delete("/workflow/:workflowName", async (req, res) => {
    try {
        // Define custom resource parameters

        await customObjectsApi.deleteNamespacedCustomObject(group, version, namespace, plural, req.params.workflowName);
        res.status(200).send({ id: req.params.workflowName, previousData: {} });
    } catch (error) {
        console.error("Error:", error);
        if (error instanceof HttpError) {
            console.error("Error:", error);
            res.status(error.statusCode ?? 500).send(responseMessage(error.body.statusCode, error.body.message));
        }
    }
});
