import type {
    BaseRecord,
    CreateParams,
    DataProvider,
    DeleteOneParams,
    GetListParams,
    GetManyParams,
    GetOneParams,
    UpdateParams,
    UpdateResponse,
} from "@refinedev/core";

const API_URL = "http://localhost:8060";

function validateResponseStatus(response: Response) {
    if (response.status < 200 || response.status > 299) {
        throw new Error(response.statusText);
    }
}

export const dataProvider: DataProvider = {
    getOne: async <TData extends BaseRecord = BaseRecord>({resource, id}: GetOneParams) => {
        const response = await fetch(`${API_URL}/${resource}/${id}`);

        validateResponseStatus(response);

        // Use ResourceMapping to determine the correct return type based on the resource
        const data = (await response.json()) as TData;

        return {data};
    },
    update: async <TData extends BaseRecord = BaseRecord, TVariables = { [key: string]: unknown }>({
                                                                                                       resource,
                                                                                                       id,
                                                                                                       variables,
                                                                                                   }: UpdateParams<TVariables>): Promise<UpdateResponse<TData>> => {
        console.log("variables", variables);
        const response = await fetch(`${API_URL}/${resource}/${id}`, {
            method: "PUT",
            body: JSON.stringify(variables),
            headers: {
                "Content-Type": "application/json",
            },
        });

        validateResponseStatus(response);

        const data = (await response.json()) as TData;

        return {data};
    },
    getList: async <TData extends BaseRecord = BaseRecord>({resource}: GetListParams) => {
        const response = await fetch(`${API_URL}/${resource}`);

        validateResponseStatus(response);

        const data = (await response.json()) as TData[];
        const total = Number(response.headers.get("Content-Range"));

        return {
            data,
            total: total, // We'll cover this in the next steps.
        };
    },
    create: async <TData extends BaseRecord = BaseRecord, TVariables = { [key: string]: unknown }>({
                                                                                                       resource,
                                                                                                       variables,
                                                                                                   }: CreateParams<TVariables>) => {
        console.log("posting values", JSON.stringify(variables));
        const response = await fetch(`${API_URL}/${resource}`, {
            method: "POST",
            body: JSON.stringify(variables),
            headers: {
                "Content-Type": "application/json",
            },
        });

        validateResponseStatus(response);

        const data = (await response.json()) as TData;

        return {data};
    },
    deleteOne: async <TData extends BaseRecord = BaseRecord, TVariables = { [key: string]: unknown }>({
                                                                                                          resource,
                                                                                                          id,
                                                                                                      }: DeleteOneParams<TVariables>) => {
        const response = await fetch(`${API_URL}/${resource}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        validateResponseStatus(response);

        const data = (await response.json()) as TData;
        return {data};
    },
    getMany: async <TData extends BaseRecord = BaseRecord>({resource, ids}: GetManyParams) => {
        const params = new URLSearchParams();

        if (ids) {
            for (const id of ids) {
                params.append("id", id.toString());
            }
        }

        const response = await fetch(`${API_URL}/${resource}?${params.toString()}`);

        validateResponseStatus(response);

        const data = (await response.json()) as TData[];

        return {data};
    },
    getApiUrl: () => API_URL,
};
