import { http, HttpResponse, type JsonBodyType } from "msw";
import type { TWorkflow } from "../../../trash/types/Workflow";
import { templates, workflows, hardware } from "./data/data";
import type { THardware } from "../../../trash/types/Hardware";
import type { TTemplate } from "../../../trash/types/Template";

const hardwareMockData = new Map<string, THardware>(
	hardware.map((item) => [item.name, item]),
);

const workflowMockData = new Map<string, TWorkflow>(
	workflows.map((item) => [item.name, item]),
);

const templateMockData = new Map<string, TTemplate>(
	templates.map((template) => [template.name, template]),
);

export const handlers = [
	// Intercept "GET https://example.com/user" requests...
	http.get("http://localhost:8060/hardware", () => {
		// ...and respond to them using this JSON response.
		return HttpResponse.json(Array.from(hardwareMockData.values()));
	}),
	http.delete<{ id: string }>(
		"http://localhost:8060/hardware/:id",
		({ params }) => {
			const { id } = params;
			const hardwareObj = hardwareMockData.get(id.toString());
			if (!hardwareObj) {
				return HttpResponse.json(
					{ error: "Hardware not found." },
					{ status: 400 },
				);
			} else {
				hardwareMockData.delete(id.toString());
				return HttpResponse.json({ message: "Hardware deleted successfully." });
			}
		},
	),
	http.post<never, THardware & { id: string }, THardware>(
		"http://localhost:8060/hardware",
		async ({ request }) => {
			const newHw = await request.json();
			newHw.id = newHw.name;
			newHw.creationTimestamp = new Date().toISOString();
			hardwareMockData.set(newHw.name, newHw);
			return HttpResponse.json(newHw);
		},
	),
	http.put<
		{ id: string },
		THardware & { id: string },
		THardware | JsonBodyType
	>("http://localhost:8060/hardware/:id", async ({ params, request }) => {
		// ...and respond to them using this JSON response.
		const { id } = params;
		const postedData: THardware = await request.json();
		console.log("posted hw data", postedData);
		const hardwareObj = hardwareMockData.get(id.toString());
		if (!hardwareObj) {
			return HttpResponse.json(
				{ error: "Hardware not found." },
				{ status: 400 },
			);
		} else {
			hardwareObj.spec = postedData.spec;
			hardwareMockData.set(id.toString(), hardwareObj);
			return HttpResponse.json(hardwareObj);
		}
	}),
	http.get("http://localhost:8060/hardware/:id", ({ params }) => {
		const { id } = params;
		if (!params || !id)
			return HttpResponse.json({ error: "ID is required" }, { status: 400 });
		// ...and respond to them using this JSON response.
		return HttpResponse.json(hardwareMockData.get(id.toString()));
	}),
	http.get("http://localhost:8060/workflow", () => {
		// ...and respond to them using this JSON response.
		return HttpResponse.json(Array.from(workflowMockData.values()));
	}),
	http.delete("http://localhost:8060/workflow/:id", ({ params }) => {
		const { id } = params;
		if (!params || !id)
			return HttpResponse.json({ error: "ID is required" }, { status: 400 });
		const wf = workflowMockData.get(id.toString());
		if (wf) {
			workflowMockData.delete(wf.name);
			return HttpResponse.json(wf);
		} else {
			return HttpResponse.json(
				{ error: "Workflow not found." },
				{ status: 400 },
			);
		}
	}),
	http.get("http://localhost:8060/workflow/:id", ({ params }) => {
		const { id } = params;
		if (!params || !id)
			return HttpResponse.json({ error: "ID is required" }, { status: 400 });
		// ...and respond to them using this JSON response.
		return HttpResponse.json(workflowMockData.get(id.toString()));
	}),
	http.post<never, TWorkflow & { id: string }, TWorkflow>(
		"http://localhost:8060/workflow",
		async ({ request }) => {
			const newWf = await request.json();
			newWf.id = newWf.name;
			newWf.creationTimestamp = new Date().toISOString();
			workflowMockData.set(newWf.name, newWf);
			return HttpResponse.json(newWf);
		},
	),
	http.put<
		{ id: string },
		TWorkflow & { id: string },
		TWorkflow | JsonBodyType
	>("http://localhost:8060/workflow/:id", async ({ params, request }) => {
		const { id } = params;
		const updatedWf = await request.json();
		console.log(updatedWf);
		const wf = workflowMockData.get(id.toString());
		if (wf) {
			wf.spec.templateRef = updatedWf.spec.templateRef ?? wf.spec.templateRef;
			wf.spec.hardwareRef = updatedWf.spec.hardwareRef ?? wf.spec.hardwareRef;
			workflowMockData.set(wf.name, wf);
			return HttpResponse.json(wf);
		} else {
			return HttpResponse.json(
				{ error: "Workflow not found." },
				{ status: 400 },
			);
		}
	}),
	http.get("http://localhost:8060/template", () => {
		// ...and respond to them using this JSON response.
		return HttpResponse.json(Array.from(templateMockData.values()));
	}),
	http.delete("http://localhost:8060/template/:id", ({ params }) => {
		const { id } = params;
		if (!params || !id)
			return HttpResponse.json({ error: "ID is required" }, { status: 400 });
		const wf = templateMockData.get(id.toString());
		if (wf) {
			templateMockData.delete(wf.name);
			return HttpResponse.json(wf);
		} else {
			return HttpResponse.json(
				{ error: "Template not found." },
				{ status: 400 },
			);
		}
	}),
	http.get("http://localhost:8060/template/:id", ({ params }) => {
		const { id } = params;
		if (!params || !id)
			return HttpResponse.json({ error: "ID is required" }, { status: 400 });
		// ...and respond to them using this JSON response.
		return HttpResponse.json(templateMockData.get(id.toString()));
	}),
];
