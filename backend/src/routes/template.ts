import {
	environmentSchema,
	type TTemplate,
	type TTemplateEnvvar,
	type TTemplateK8s,
	type TTemplateK8sTask,
	type TTemplateSpec,
	TTemplateSpecData,
	type TTemplateTask,
} from "shared/src/types/Template";
import type { KubernetesObject, V1ObjectMeta } from "@kubernetes/client-node";

import { Router } from "express";
import {
	PatchUtils,
	loadYaml,
	dumpYaml,
	HttpError,
} from "@kubernetes/client-node";
// const {KubeConfig, CustomObjectsApi, PatchUtils} = require('@kubernetes/client-node');
// const { UserController } = require("../controllers/users.js");
import { customObjectsApi } from "../resources/k8s";
import { responseMessage } from "../index.ts";
import type { THardwareSpec } from "shared/src/types/Hardware.ts";

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
	// const tasks = loadYaml<TTemplateSpecData>(k8sObject.spec?.data).tasks;
	const returnObj: TTemplate = {
		id: k8sObject.metadata.name,
		uid: k8sObject.metadata.uid,
		name: k8sObject.metadata.name ?? "",
		creationTimestamp: k8sObject.metadata.creationTimestamp,
		spec: { data: loadYaml(k8sObject.spec?.data) },
	};

	if ((returnObj.spec?.data?.tasks?.length ?? 0) > 0) {
		for (const task of returnObj.spec?.data?.tasks ?? []) {
			// if (Array.isArray(task.environment) && task.environment.length > 0) {
			// 	for (const envar of task.environment) {
			// 		console.log(envar);
			// 	}
			// }
			if (task.environment && !Array.isArray(task.environment)) {
				const envarArray = new Array<TTemplateEnvvar>();
				for (const [key, value] of Object.entries<Record<string, string>>(
					task.environment,
				)) {
					envarArray.push({ var: key, val: task.environment[key] });
				}
				task.environment = envarArray;
			}

			if (task.actions.length > 0) {
				for (const action of task.actions) {
					if (action.environment && !Array.isArray(action.environment)) {
						const actionEnvvars = new Array<TTemplateEnvvar>();
						for (const [key, value] of Object.entries<Record<string, string>>(
							action.environment,
						)) {
							actionEnvvars.push({ var: key, val: action.environment[key] });
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
	const envVarObj: Record<string, any> = {};
	for (const task of template.spec?.data?.tasks ?? []) {
		if (Array.isArray(task.environment)) {
			for (const envvar of task.environment) {
				envVarObj[envvar.var] = envvar.val;
			}
		}
		k8sObjectTasks.push({ ...task, environment: envVarObj });
	}

	return {
		data: dumpYaml({
			tasks: k8sObjectTasks,
		}),
	};
};
templateRouter.get("/template", async (req, res) => {
	try {
		// Define custom resource parameters
		console.log("Getting template");
		// List custom resources
		const k8sTemplateList = await customObjectsApi.listNamespacedCustomObject(
			group,
			version,
			namespace,
			plural,
		);

		const templateList = new Array<TTemplate>();
		const items = (k8sTemplateList.body as any).items as k8sTemplateObject[];
		for (const item of items) {
			templateList.push(TemplateFromK8sObject(item));
		}
		res.header("Content-Range", templateList.length.toString());
		res.header("Content-Type", "application/json");
		res.json(templateList);
	} catch (error) {
		console.error("Error:", error);
		if (error instanceof HttpError) {
			console.error("Error:", error);
			res
				.status(error.statusCode ?? 500)
				.send(responseMessage(error.body.statusCode, error.body.message));
		}
	}
});
templateRouter.get("/template/:templateName", async (req, res) => {
	try {
		// List custom resources
		const k8sTemplate = await customObjectsApi.getNamespacedCustomObject(
			group,
			version,
			namespace,
			plural,
			req.params.templateName,
		);

		const hw = TemplateFromK8sObject(k8sTemplate.body as k8sTemplateObject);

		res.header("Content-Type", "application/json");
		res.json(hw);
	} catch (error) {
		if (error instanceof HttpError) {
			console.error("Error:", error);
			res
				.status(error.statusCode ?? 500)
				.send(responseMessage(error.body.statusCode, error.body.message));
		}
	}
});
templateRouter.put("/template/:templateName", async (req, res) => {
	const hwSimplifiedList = [];
	try {
		// Define custom resource parameters

		console.log("Body:", req.body);
		const templateSpec = K8sSpecFromTemplate(req.body);
		console.log("Reversed template:", templateSpec);

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
		await customObjectsApi.patchNamespacedCustomObject(
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
		);
		res.status(200).send(responseMessage(200, "Template updated successfully"));
	} catch (error) {
		if (error instanceof HttpError) {
			console.error("Error:", error);
			res
				.status(error.statusCode ?? 500)
				.send(responseMessage(error.body.statusCode, error.body.message));
		}
	}
});
// templateRouter.post("/template", async (req, res) => {
// 	try {
// 		// Define custom resource parameters
//
// 		const hwObject = {
// 			apiVersion: `${group}/${version}`,
// 			kind: "Template",
// 			metadata: {
// 				name: req.body.name,
// 				namespace: "default",
// 			},
// 			spec: req.body.spec,
// 		};
//
// 		const options = {
// 			headers: {
// 				"Content-type": "application/json",
// 			},
// 		};
// 		await customObjectsApi
// 			.createNamespacedCustomObject(
// 				group,
// 				version,
// 				namespace,
// 				plural,
// 				hwObject,
// 				undefined,
// 				undefined,
// 				undefined,
// 				options,
// 			)
// 			.then((result) => {
// 				const hw = TemplateFromK8sObject(result.body);
// 				console.log(hw);
//
// 				res.status(200).send(hw);
// 			})
// 			.catch((reason) => {
// 				console.error("Error:", reason);
// 				res
// 					.status(reason.statusCode)
// 					.send(responseMessage(reason.statusCode, reason.body.message));
// 			});
// 	} catch (error) {
// 		if (error instanceof HttpError) {
// 			console.error("Error:", error);
// 			res
// 				.status(error.statusCode ?? 500)
// 				.send(responseMessage(error.body.statusCode, error.body.message));
// 		}
// 	}
// });
// templateRouter.delete("/template/:templateName", async (req, res) => {
// 	const hwSimplifiedList = [];
// 	try {
// 		// Define custom resource parameters
//
// 		await customObjectsApi.deleteNamespacedCustomObject(
// 			group,
// 			version,
// 			namespace,
// 			plural,
// 			req.params.templateName,
// 		);
// 		res.status(200).send({ id: req.params.templateName, previousData: {} });
// 	} catch (error) {
// 		if (error instanceof HttpError) {
// 			console.error("Error:", error);
// 			res
// 				.status(error.statusCode ?? 500)
// 				.send(responseMessage(error.body.statusCode, error.body.message));
// 		}
// 	}
// });
