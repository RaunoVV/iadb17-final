import { templateSchema } from "./Template";
import { hardwareSchema } from "./Hardware";
import { z } from "zod";
import { baseSchema } from "./Base";

enum WorkflowState {
    Pending = "STATE_PENDING",
    Running = "STATE_RUNNING",
    Failed = "STATE_FAILED",
    Timeout = "STATE_TIMEOUT",
    Success = "STATE_SUCCESS",
}

const workflowStateSchema = z.nativeEnum(WorkflowState);

const workflowSpecSchema = z.object({
    templateRef: z.string(),
    hardwareRef: z.string(),
    hardwareMap: z.record(z.string()).optional(),
});

const workflowSpecFormValuesSchema = z.object({
    templateRef: z.union([z.string(), templateSchema]),
    hardwareRef: z.union([z.string(), hardwareSchema]),
});

const actionSchema = z.object({
    name: z.string().optional(),
    image: z.string().optional(),
    timeout: z.number().optional(),
    command: z.array(z.string()).optional(),
    volumes: z.array(z.string()).optional(),
    pid: z.string().optional(),
    environment: z.record(z.string()).optional(),
    status: workflowStateSchema.optional(),
    startedAt: z.date().optional(),
    seconds: z.number().optional(),
    message: z.string().optional(),
});

const taskSchema = z.object({
    name: z.string(),
    workerAddr: z.string(),
    actions: z.array(actionSchema),
    volumes: z.array(z.string()).optional(),
    environment: z.record(z.string()).optional(),
});

const workflowStatusSchema = z.object({
    state: workflowStateSchema.optional(),
    globalTimeout: z.number().optional(),
    tasks: z.array(taskSchema).optional(),
});

export const workflowSchema = baseSchema.extend({
    spec: workflowSpecSchema,
    status: workflowStatusSchema.optional(),
});

export const workflowFormValuesSchema = z.object({
    spec: workflowSpecFormValuesSchema,
    status: workflowStatusSchema.optional(),
});

export type TWorkflow = z.infer<typeof workflowSchema>;
export type TWorkflowSpec = z.infer<typeof workflowSpecSchema>;
export type TWorkflowFormValues = z.infer<typeof workflowFormValuesSchema>;

export const isWorkflow = (value: unknown): value is TWorkflow => {
    return workflowSchema.safeParse(value).success;
};
