import type { DataProvider } from "@refinedev/core";

const API_URL = "http://localhost:8060";

export const dataProvider: DataProvider = {
	getOne: async ({ resource, id, meta }) => {
		const response = await fetch(`${API_URL}/${resource}/${id}`);

		if (response.status < 200 || response.status > 299)
			throw new Error(response.statusText);

		const data = await response.json();

		return { data };
	},
	update: async ({ resource, id, variables }) => {
		const response = await fetch(`${API_URL}/${resource}/${id}`, {
			method: "PUT",
			body: JSON.stringify(variables),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (response.status < 200 || response.status > 299) throw response;

		const data = await response.json();

		return { data };
	},
	getList: async ({ resource, pagination, filters, sorters, meta }) => {
		const response = await fetch(`${API_URL}/${resource}`);

		if (response.status < 200 || response.status > 299) throw response;

		const data = await response.json();

		return {
			data,
			total: 0, // We'll cover this in the next steps.
		};
	},
	create: async ({ resource, variables }) => {
		console.log("posting values", JSON.stringify(variables));
		const response = await fetch(`${API_URL}/${resource}`, {
			method: "POST",
			body: JSON.stringify(variables),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (response.status < 200 || response.status > 299) throw response;

		const data = await response.json();

		return { data };
	},
	deleteOne: async ({ resource, id }) => {
		const response = await fetch(`${API_URL}/${resource}/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (response.status < 200 || response.status > 299)
			throw new Error(response.statusText);

		const data = await response.json();
		return { data };
	},
	getMany: async ({ resource, ids, meta }) => {
		const params = new URLSearchParams();

		if (ids) {
			for (const id of ids) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				params.append("id", id);
			}
		}

		const response = await fetch(`${API_URL}/${resource}?${params.toString()}`);

		if (response.status < 200 || response.status > 299) throw response;

		const data = await response.json();

		return { data };
	},
	getApiUrl: () => API_URL,
	// Optional methods:
	// getMany: () => { /* ... */ },
	// createMany: () => { /* ... */ },
	// deleteMany: () => { /* ... */ },
	// updateMany: () => { /* ... */ },
	// custom: () => { /* ... */ },
};
