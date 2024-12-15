import { z } from "zod";
import { baseSchema } from "./Base";

const hardwareFacilitySchema = z.object({
    facility_code: z.string(),
});

const hardwareSpecMetadataInstanceSchema = z.object({
    hostname: z.string(),
    id: z.string(),
    operating_system: z.any(),
});

const hardwareSpecMetadataSchema = z.object({
    facility: hardwareFacilitySchema,
    instance: hardwareSpecMetadataInstanceSchema.optional(),
});

const hardwareDiskSchema = z.object({
    device: z.string(),
});

const interfaceIPSchema = z.object({
    address: z.string().ip({version: "v4"}).default("10.10.10.2"),
    gateway: z.string().ip().default("10.10.10.1"),
    netmask: z.string().ip().default("255.255.255.0"),
});

const interfaceNebootSchema = z.object({
    allowPXE: z.boolean(),
    allowWorkflow: z.boolean(),
    ipxe: z.any().optional(),
});

const macAddressRegex = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
export const interfaceDhcpSchema = z.object({
    arch: z.string().optional(),
    hostname: z.string().default("localhost"),
    ip: interfaceIPSchema,
    lease_time: z.literal(86400).optional(),
    mac: z
        .string()
        .regex(macAddressRegex, {
            message: "Invalid MAC address format",
        })
        .default("aa:bb:cc:dd:ee"),
    name_servers: z.array(z.string().ip()).optional(),
    uefi: z.boolean().optional().default(true),
});

export const hardwareInterfaceSchema = z.object({
    dhcp: interfaceDhcpSchema,
    netboot: interfaceNebootSchema.nullish(),
});

export const hardwareSpecSchema = z.object({
    metadata: hardwareSpecMetadataSchema.optional(),
    disks: z.array(hardwareDiskSchema).optional(),
    interfaces: z.array(hardwareInterfaceSchema),
});

export const hardwareSchema = baseSchema.extend({
    name: z.string(),
    id: z.string().optional(),
    uid: z.string().uuid().optional(),
    description: z.string().optional(),
    spec: hardwareSpecSchema.nullish(),
    sw_raid: z.boolean().optional(),
});

export type THardware = z.infer<typeof hardwareSchema>;
export type THardwareSpec = z.infer<typeof hardwareSpecSchema>;
export type THardwareInterface = z.infer<typeof hardwareInterfaceSchema>;
