import { Router } from "express";
import { PatchUtils, HttpError, type V1ObjectMeta, type KubernetesObject } from "@kubernetes/client-node";

import { customObjectsApi } from "../resources/k8s.ts";
import { responseMessage } from "../index.ts";
import type { TTemplate } from "shared/src/types/Template.ts";
import type { THardware, THardwareSpec } from "shared/src/types/Hardware.ts";

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
const hardwareSpecFixup = (hardwareObj: TTemplate) => {
    // if (hardwareObj.sw_raid === false) {
    //     hardwareObj.spec.disks = hardwareObj.spec.disks.slice(0, 1);
    // }
    return hardwareObj;
};
hardwareRouter.get("/hardware", async (req, res) => {
    try {
        // Define custom resource parameters

        // List custom resources
        const k8sHardwareListResp = await customObjectsApi.listNamespacedCustomObject(
            group,
            version,
            namespace,
            plural,
        );
        const items = (k8sHardwareListResp.body as any).items as any[];

        console.log("test");
        const hardwareList = new Array<THardware>();
        for (const item of items) {
            hardwareList.push(HardwareFromK8sObject(item));
        }

        res.header("Content-Range", hardwareList.length.toString());
        res.header("Content-Type", "application/json");
        res.json(hardwareList);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});
hardwareRouter.get("/hardware/:hardwareName", async (req, res) => {
    try {
        // List custom resources
        const k8sHardware = await customObjectsApi.getNamespacedCustomObject(
            group,
            version,
            namespace,
            plural,
            req.params.hardwareName,
        );

        const hw = HardwareFromK8sObject(k8sHardware.body as k8sHardwareObject);
        console.log(hw);
        res.header("Content-Type", "application/json");
        res.json(hw);
    } catch (error) {
        if (error instanceof HttpError) {
            console.error("Error:", error);
            res.status(error.statusCode ?? 500).send(responseMessage(error.statusCode, error.message));
        }
    }
});
hardwareRouter.put("/hardware/:hardwareName", async (req, res) => {
    const hwSimplifiedList = [];
    console.debug("input: ", req.body);
    const hwData = hardwareSpecFixup(req.body);
    console.debug("parsed: ", hwData);
    try {
        // Define custom resource parameters

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
            .catch((error) => {
                console.error("Error:", error);
                res.status(error.statusCode).send(responseMessage(error.statusCode, error.message));
            });
    } catch (error) {
        if (error instanceof HttpError) {
            console.error("Error:", error);
            res.status(error.statusCode ?? 500).send(responseMessage(error.statusCode, error.message));
        }
    }
});
hardwareRouter.post("/hardware", async (req, res) => {
    try {
        // Define custom resource parameters

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
                console.log(hw);

                res.status(200).send(hw);
            })
            .catch((reason) => {
                console.error("Error:", reason);
                res.status(reason.statusCode).send(responseMessage(reason.statusCode, reason.body.message));
            });
    } catch (error) {
        if (error instanceof HttpError) {
            console.error("Error:", error);
            res.status(error.statusCode ?? 500).send(responseMessage(error.body.statusCode, error.body.message));
        }
    }
});
hardwareRouter.delete("/hardware/:hardwareName", async (req, res) => {
    const hwSimplifiedList = [];
    try {
        // Define custom resource parameters
        console.log("Deleteing hw obj");
        await customObjectsApi.deleteNamespacedCustomObject(group, version, namespace, plural, req.params.hardwareName);
        res.status(200).send({ id: req.params.hardwareName, previousData: {} });
    } catch (error) {
        if (error instanceof HttpError) {
            console.error("Error:", error);
            res.status(error.statusCode ?? 500).send(responseMessage(error.body.statusCode, error.body.message));
        }
    }
});
