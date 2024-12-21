import {Router} from "express";
import {
    type KubernetesListObject,
    type KubernetesObject,
    PatchUtils,
    type V1ObjectMeta,
} from "@kubernetes/client-node";

import {customObjectsApi} from "../resources/k8s";
import type {THardware, THardwareSpec} from "shared/src/types/Hardware";
import {responseMessage} from "../utils";

export const hardwareRouter = Router();

const group = "tinkerbell.org";
const version = "v1alpha1";
const namespace = "default";
const plural = "hardware";

interface k8sHardwareObject extends KubernetesObject {
    metadata: V1ObjectMeta;
    spec: THardwareSpec;
}
const HardwareFromK8sObject = (k8sObject: k8sHardwareObject): THardware => {
    return {
        id: k8sObject.metadata.name,
        uid: k8sObject.metadata.uid,
        name: k8sObject.metadata.name ?? "",
        creationTimestamp: k8sObject.metadata.creationTimestamp,
        spec: k8sObject.spec,
        // sw_raid: k8sObject.spec?.disks?.length === 2,
    };
};

hardwareRouter.get("/hardware", async (req, res) => {

    await customObjectsApi
        .listNamespacedCustomObject(group, version, namespace, plural)
        .then((result) => {
            const items = (result.body as KubernetesListObject<k8sHardwareObject>)
                .items as k8sHardwareObject[];

            const hardwareList = new Array<THardware>();
            for (const item of items) {
                hardwareList.push(HardwareFromK8sObject(item));
            }

            res.header("Content-Range", hardwareList.length.toString());
            res.header("Content-Type", "application/json");
            res.json(hardwareList);
        })
        .catch((reason) => {
            const errorMessage = ["Error:", req.path, req.method, reason];
            console.error(...errorMessage);
            res
                .status(reason.statusCode)
                .send(responseMessage(reason.statusCode, errorMessage.join(",")));
        });
});
hardwareRouter.get("/hardware/:hardwareName", async (req, res) => {

    await customObjectsApi
        .getNamespacedCustomObject(
            group,
            version,
            namespace,
            plural,
            req.params.hardwareName,
        )
        .then((result) => {
            const hw = HardwareFromK8sObject(result.body as k8sHardwareObject);
            res.header("Content-Type", "application/json");
            res.json(hw);
        })
        .catch((reason) => {
            const errorMessage = ["Error:", req.path, req.method, reason];
            console.error(...errorMessage);
            res
                .status(reason.statusCode)
                .send(responseMessage(reason.statusCode, errorMessage.join(",")));
        });
});
hardwareRouter.put("/hardware/:hardwareName", async (req, res) => {
    const hwData = req.body;

    const patch = [
        {
            op: "replace",
            path: "/spec",
            value: hwData.spec,
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
            req.params.hardwareName,
            patch,
            undefined,
            undefined,
            undefined,
            options,
        )
        .then((k8sRes) => {
            const hw = HardwareFromK8sObject(k8sRes.body as k8sHardwareObject);
            res.header("Content-Type", "application/json");
            res.json(hw);
        })
        .catch((reason) => {
            const errorMessage = ["Error:", req.path, req.method, reason];
            console.error(...errorMessage);
            res
                .status(reason.statusCode)
                .send(responseMessage(reason.statusCode, errorMessage.join(",")));
        });
});
hardwareRouter.post("/hardware", async (req, res) => {

    const hwObject = {
        apiVersion: `${group}/${version}`,
        kind: "Hardware",
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
            hwObject,
            undefined,
            undefined,
            undefined,
            options,
        )
        .then((result) => {
            const hw = HardwareFromK8sObject(result.body as k8sHardwareObject);
            res.status(200).send(hw);
        })
        .catch((reason) => {
            const errorMessage = ["Error:", req.path, req.method, reason];
            console.error(...errorMessage);
            res
                .status(reason.statusCode)
                .send(responseMessage(reason.statusCode, errorMessage.join(",")));
        });
});

hardwareRouter.delete("/hardware/:hardwareName", async (req, res) => {

    await customObjectsApi
        .deleteNamespacedCustomObject(
            group,
            version,
            namespace,
            plural,
            req.params.hardwareName,
        )
        .then((result) => {
            // res.status(200).send({ id: req.params.hardwareName, previousData: {} });
            res
                .status(200)
                .send(HardwareFromK8sObject(result.body as k8sHardwareObject));
        })
        .catch((reason) => {
            const errorMessage = ["Error:", req.path, req.method, reason];
            console.error(...errorMessage);
            res
                .status(reason.statusCode)
                .send(responseMessage(reason.statusCode, errorMessage.join(",")));
        });
});
