import { z } from "zod";

export const baseSchema = z.object({
    name: z.string().min(3),
    id: z.string().optional(),
    uid: z.string().optional(),
    creationTimestamp: z.date().optional(),
});
