import type {TTemplate, TTemplateEnvvar, TTemplateK8sTask, TTemplateSpec,} from "shared/src/types/Template";
import type {KubernetesListObject, KubernetesObject, V1ObjectMeta,} from "@kubernetes/client-node";
import {dumpYaml, loadYaml, PatchUtils} from "@kubernetes/client-node";

import {Router} from "express";
import {customObjectsApi} from "../resources/k8s";

import {responseMessage} from "../utils";

export const templateRouter = Router();

const group = "tinkerbell.org";
const version = "v1alpha1";
const namespace = "default";
const plural = "templates";

interface k8sTemplateObject extends KubernetesObject {
    metadata: V1ObjectMeta;
    spec: TTemplateSpec;
}

const TemplateFromK8sObject = (k8sObject: k8sTemplateObject): TTemplate => {
    const returnObj: TTemplate = {
        id: k8sObject.metadata.name,
        uid: k8sObject.metadata.uid,
        name: k8sObject.metadata.name ?? "",
        creationTimestamp: k8sObject.metadata.creationTimestamp,
        spec: {data: loadYaml(k8sObject.spec?.data)},
    };

    if ((returnObj.spec?.data?.tasks?.length ?? 0) > 0) {
        for (const task of returnObj.spec?.data?.tasks ?? []) {
            if (task.environment && !Array.isArray(task.environment)) {
                const envarArray = new Array<TTemplateEnvvar>();
                for (const [key] of Object.entries<Record<string, string>>(
                    task.environment,
                )) {
                    envarArray.push({var: key, val: task.environment[key]});
                }
                task.environment = envarArray;
            }

            if (task.actions.length > 0) {
                for (const action of task.actions) {
                    if (action.environment && !Array.isArray(action.environment)) {
                        const actionEnvvars = new Array<TTemplateEnvvar>();
                        for (const [key] of Object.entries<Record<string, string>>(
                            action.environment,
                        )) {
                            actionEnvvars.push({var: key, val: action.environment[key]});
                        }
                        action.environment = actionEnvvars;
                    }
                }
            }
        }
    }
    return returnObj;
};
const K8sSpecFromTemplate = (template: TTemplate): { data: string } => {
    const k8sObjectTasks = new Array<TTemplateK8sTask>();
    const envVarObj: Record<string, string | boolean | number> = {};
    for (const task of template.spec?.data?.tasks ?? []) {
        if (Array.isArray(task.environment)) {
            for (const envvar of task.environment) {
                envVarObj[envvar.var] = envvar.val;
            }
        }
        k8sObjectTasks.push({...task, environment: envVarObj});
    }

    return {
        data: dumpYaml({
            tasks: k8sObjectTasks,
        }),
    };
};
templateRouter.get("/template", async (req, res) => {
    await customObjectsApi
        .listNamespacedCustomObject(group, version, namespace, plural)
        .then((result) => {
            const templateList = new Array<TTemplate>();
            const items = (result.body as KubernetesListObject<k8sTemplateObject>)
                .items as k8sTemplateObject[];
            for (const item of items) {
                templateList.push(TemplateFromK8sObject(item));
            }
            res.header("Content-Range", templateList.length.toString());
            res.header("Content-Type", "application/json");
            res.json(templateList);
        })
        .catch((reason) => {
            const errorMessage = ["Error:", req.path, req.method, reason];
            console.error(...errorMessage);
            res
                .status(reason.statusCode)
                .send(responseMessage(reason.statusCode, errorMessage.join(",")));
        });
});
templateRouter.get("/template/:templateName", async (req, res) => {
    await customObjectsApi
        .getNamespacedCustomObject(
            group,
            version,
            namespace,
            plural,
            req.params.templateName,
        )
        .then((result) => {
            const tpl = TemplateFromK8sObject(result.body as k8sTemplateObject);

            res.header("Content-Type", "application/json");
            res.json(tpl);
        })
        .catch((reason) => {
            const errorMessage = ["Error:", req.path, req.method, reason];
            console.error(...errorMessage);
            res
                .status(reason.statusCode)
                .send(responseMessage(reason.statusCode, errorMessage.join(",")));
        });
});
templateRouter.put("/template/:templateName", async (req, res) => {
    const templateSpec = K8sSpecFromTemplate(req.body);

    const patch = [
        {
            op: "replace",
            path: "/spec",
            value: templateSpec,
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
            req.params.templateName,
            patch,
            undefined,
            undefined,
            undefined,
            options,
        )
        .then((result) => {
            const tpl = TemplateFromK8sObject(result.body as k8sTemplateObject);
            res.header("Content-Type", "application/json");
            res.json(tpl);
        })
        .catch((reason) => {
            const errorMessage = ["Error:", req.path, req.method, reason];
            console.error(...errorMessage);
            res
                .status(reason.statusCode)
                .send(responseMessage(reason.statusCode, errorMessage.join(",")));
        });
});
templateRouter.post("/template", async (req, res) => {
    const tplObject = {
        apiVersion: `${group}/${version}`,
        kind: "Template",
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
            tplObject,
            undefined,
            undefined,
            undefined,
            options,
        )
        .then((result) => {
            const tpl = TemplateFromK8sObject(result.body as k8sTemplateObject);
            res.status(200).send(tpl);
        })
        .catch((reason) => {
            const errorMessage = ["Error:", req.path, req.method, reason];
            console.error(...errorMessage);
            res
                .status(reason.statusCode)
                .send(responseMessage(reason.statusCode, errorMessage.join(",")));
        });
});
templateRouter.delete("/template/:templateName", async (req, res) => {
    await customObjectsApi
        .deleteNamespacedCustomObject(
            group,
            version,
            namespace,
            plural,
            req.params.templateName,
        )
        .then((result) => {
            res
                .status(200)
                .send(TemplateFromK8sObject(result.body as k8sTemplateObject));
        })
        .catch((reason) => {
            const errorMessage = ["Error:", req.path, req.method, reason];
            console.error(...errorMessage);
            res
                .status(reason.statusCode)
                .send(responseMessage(reason.statusCode, errorMessage.join(",")));
        });
});
