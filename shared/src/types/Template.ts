import {z} from "zod";
import {baseSchema} from "./Base";

export const environmentSchema = z.object({
    var: z.string().min(2),
    val: z.union([z.string(), z.number(), z.boolean()]).optional(),
});
const actionSchema = z.object({
    name: z.string().min(3),
    image: z.string().min(3),
    timeout: z.coerce.number().int().positive().min(1),
    command: z.union([z.array(z.string()), z.string()]).optional(),
    pid: z.string().optional(),
    volumes: z.array(z.string()).optional(),
    environment: z.array(environmentSchema),
});

const taskSchema = z.object({
    name: z.string().min(3),
    worker: z.string().min(3),
    volumes: z.array(z.string()),
    actions: z.array(actionSchema),

    environment: z.array(environmentSchema),
});
const taskK8sSchema = taskSchema.extend({
    environment: z.union([z.array(environmentSchema), z.record(z.string(), z.any())]).optional(),
});
const specDataSchema = z.object({
    version: z.string().optional(),
    name: z.string().optional(),
    global_timeout: z.number().optional(),
    tasks: z.array(taskSchema),
});

const templateSpecSchema = z.object({
    data: specDataSchema.optional(),
});
const templateSpecK8sSchema = z.object({
    data: z.string(),
});

const templateStatusSchema = z.object({
    state: z.string().optional(),
});

export const templateSchema = baseSchema.extend({
    name: z.string().min(3),
    spec: templateSpecSchema,
    status: templateStatusSchema.optional(),
});

export const templateK8sSchema = templateSchema.extend({
    metadata: z.array(z.string()),
    spec: templateSpecK8sSchema,
});

export type TTemplate = z.infer<typeof templateSchema>;
export type TTemplateSpec = z.infer<typeof templateSpecK8sSchema>;
export type TTemplateSpecData = z.infer<typeof specDataSchema>;
export type TTemplateK8s = z.infer<typeof templateK8sSchema>;
export type TTemplateTask = z.infer<typeof taskSchema>;
export type TTemplateK8sTask = z.infer<typeof taskK8sSchema>;
export type TTemplateEnvvar = z.infer<typeof environmentSchema>;
