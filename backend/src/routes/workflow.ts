import {Router} from "express";
import {
    type KubernetesListObject,
    type KubernetesObject,
    PatchUtils,
    type V1ObjectMeta,
} from "@kubernetes/client-node";

import {customObjectsApi} from "../resources/k8s";

import type {TWorkflow, TWorkflowSpec} from "shared/src/types/Workflow";
import {responseMessage} from "../utils";

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
    await customObjectsApi
        .listNamespacedCustomObject(group, version, namespace, plural)
        .then((result) => {
            const workflowList = new Array<TWorkflow>();

            for (const item of (
                result.body as KubernetesListObject<k8sWorkflowObject>
            ).items) {
                workflowList.push(WorkflowFromK8sObject(item));
            }
            res.header("Content-Range", workflowList.length.toString());
            res.header("Content-Type", "application/json");
            res.json(workflowList);
        })
        .catch((reason) => {
            const errorMessage = ["Error:", req.path, req.method, reason];
            console.error(...errorMessage);
            res
                .status(reason.statusCode)
                .send(responseMessage(reason.statusCode, errorMessage.join(",")));
        });
});
workflowRouter.get("/workflow/:workflowName", async (req, res) => {
    await customObjectsApi
        .getNamespacedCustomObject(
            group,
            version,
            namespace,
            plural,
            req.params.workflowName,
        )
        .then((result) => {
            const wf = WorkflowFromK8sObject(result.body as k8sWorkflowObject);

            res.header("Content-Type", "application/json");
            res.json(wf);
        })
        .catch((reason) => {
            const errorMessage = ["Error:", req.path, req.method, reason];
            console.error(...errorMessage);
            res
                .status(reason.statusCode)
                .send(responseMessage(reason.statusCode, errorMessage.join(",")));
        });
});
workflowRouter.put("/workflow/:workflowName", async (req, res) => {
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
    await customObjectsApi
        .patchNamespacedCustomObject(
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
        )
        .then((result) => {
            const wf = WorkflowFromK8sObject(result.body as k8sWorkflowObject);
            res.status(200).send(wf);
        })
        .catch((reason) => {
            const errorMessage = ["Error:", req.path, req.method, reason];
            console.error(...errorMessage);
            res
                .status(reason.statusCode)
                .send(responseMessage(reason.statusCode, errorMessage.join(",")));
        });
});
workflowRouter.post("/workflow", async (req, res) => {
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
            res.status(200).send(wf);
        })
        .catch((reason) => {
            const errorMessage = ["Error:", req.path, req.method, reason];
            console.error(...errorMessage);
            res
                .status(reason.statusCode)
                .send(responseMessage(reason.statusCode, errorMessage.join(",")));
        });
});
workflowRouter.delete("/workflow/:workflowName", async (req, res) => {
    await customObjectsApi.deleteNamespacedCustomObject(
        group,
        version,
        namespace,
        plural,
        req.params.workflowName,
    ).then((result) => {
        res.status(200).send(WorkflowFromK8sObject(result.body as k8sWorkflowObject));
    }).catch((reason) => {
        const errorMessage = ["Error:", req.path, req.method, reason];
        console.error(...errorMessage);
        res
            .status(reason.statusCode)
            .send(responseMessage(reason.statusCode, errorMessage.join(",")));
    });
});
