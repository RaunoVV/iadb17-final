import type { TWorkflow } from "shared/types/Workflow";
import type { TTemplate } from "shared/types/Template";
import type { THardware } from "shared/types/Hardware";

export const workflows: TWorkflow[] = [
    {
        id: "sandbox-workflow",
        uid: "c6ae537f-503d-49d6-b99d-ec43e8891551",
        name: "sandbox-workflow",
        creationTimestamp: new Date("2022-12-05T15:03:25Z"),
        spec: {
            hardwareMap: {
                device_1: "08:00:27:9e:f5:3a",
            },
            hardwareRef: "machine1",
            templateRef: "ubuntu-focal",
        },
    },
    {
        id: "wf2",
        uid: "cd918b2e-2842-454c-9cff-9a35bd163685",
        name: "wf2",
        creationTimestamp: new Date("2023-09-26T11:56:59Z"),
        spec: {
            hardwareMap: {
                device_1: "52:54:00:f2:ed:9c",
            },
            hardwareRef: "node-525400f2ed9c",
            templateRef: "nixos",
        },
    },
    {
        id: "node-525400f2ed9c",
        uid: "89568192-c15b-4943-9fe1-bdeee201d63d",
        name: "node-525400f2ed9c",
        creationTimestamp: new Date("2024-08-23T11:18:37Z"),
        spec: {
            hardwareMap: {
                device_1: "52:54:00:f2:ed:9c",
                hv_name: "node-525400f2ed9c",
            },
            hardwareRef: "node-525400f2ed9c",
            templateRef: "nixos",
        },
    },
    {
        id: "node-5254008aacc3",
        uid: "276318b2-7de4-498f-b270-ddcf0894bcba",
        name: "node-5254008aacc3",
        creationTimestamp: new Date("2024-09-04T08:55:04Z"),
        spec: {
            hardwareMap: {
                device_1: "52:54:00:8a:ac:c3",
                hv_name: "node-5254008aacc3",
            },
            hardwareRef: "node-5254008aacc3",
            templateRef: "nixos",
        },
    },
    {
        id: "aaacccc",
        uid: "93036e8f-fc99-4b83-8103-5a8636bbe411",
        name: "aaacccc",
        creationTimestamp: new Date("2024-09-16T20:02:12Z"),
        spec: {
            hardwareRef: "node-502cc6c065c9",
            templateRef: "ubuntu-focal",
        },
    },
    {
        id: "jjghjghjghj",
        uid: "7d3b3ce2-62bd-4c86-b54f-ce8416f38bb5",
        name: "jjghjghjghj",
        creationTimestamp: new Date("2024-09-16T20:03:40Z"),
        spec: {
            hardwareMap: {
                device_1: "52:54:00:8a:ac:c3",
            },
            hardwareRef: "node-5254008aacc3",
            templateRef: "nixos",
        },
    },
];
export const templates: TTemplate[] = [
    {
        id: "nixos",
        uid: "64d0f2e1-b172-458a-9b1a-7b8362a362a3",
        name: "nixos",
        creationTimestamp: new Date("2022-12-05T13:15:34Z"),
        spec: {
            data: {
                version: "0.1",
                name: "debian_Focal",
                global_timeout: 1800,
                tasks: [
                    {
                        name: "os-installation",
                        worker: "{{.device_1}}",
                        environment: [
                            {
                                var: "MIRROR_HOST",
                                val: "192.168.123.1",
                            },
                        ],
                        volumes: [
                            "/dev:/dev",
                            "/dev/console:/dev/console",
                            "/lib/firmware:/lib/firmware:ro",
                            "/sys/firmware:/sys/firmware",
                        ],
                        actions: [
                            {
                                name: "nixos",
                                image: "warrenio/nixos-installer:latest",
                                timeout: 900,
                                environment: [{ var: "", val: "" }],
                                command: [],
                            },
                            {
                                name: "disable-hw-pxe",
                                image: "warrenio/tinkerbell-disable-hw-pxe",
                                timeout: 90,
                                command: [],
                                environment: [
                                    {
                                        var: "IMAGE",
                                        val: "warrenio/tinkerbell-disable-hw-pxe",
                                    },
                                    {
                                        var: "HW_NAME",
                                        val: "{{.hv_name}}",
                                    },
                                ],
                            },
                            {
                                name: "reboot",
                                image: "ghcr.io/jacobweinstock/waitdaemon:0.2.0",
                                timeout: 90,
                                pid: "host",
                                command: ["reboot"],
                                environment: [
                                    {
                                        var: "IMAGE",
                                        val: "alpine",
                                    },
                                    {
                                        var: "WAIT_SECONDS",
                                        val: 10,
                                    },
                                ],
                                volumes: ["/var/run/docker.sock:/var/run/docker.sock"],
                            },
                        ],
                    },
                ],
            },
        },
    },
    {
        id: "nixos2",
        uid: "7b45cba2-3f7e-43a3-b53f-2e9c1dd0eced",
        name: "nixos2",
        creationTimestamp: new Date("2024-10-14T19:22:00Z"),
        spec: {
            data: {
                tasks: [
                    {
                        name: "os-installation",
                        worker: "{{.device_1}}",
                        environment: [
                            {
                                var: "TEST",
                                val: "TESTING",
                            },
                        ],
                        volumes: [
                            "/dev:/dev",
                            "/dev/console:/dev/console",
                            "/lib/firmware:/lib/firmware:ro",
                            "/sys/firmware:/sys/firmware",
                            "aaaa",
                        ],
                        actions: [
                            {
                                name: "nixos",
                                image: "warrenio/nixos-installer:latest",
                                timeout: 900,
                                environment: [{ val: "", var: "" }],
                                command: "",
                            },
                            {
                                name: "disable-hw-pxe",
                                image: "warrenio/tinkerbell-disable-hw-pxe",
                                timeout: 90,
                                command: [],
                                environment: [
                                    {
                                        var: "IMAGE",
                                        val: "warrenio/tinkerbell-disable-hw-pxe",
                                    },
                                    {
                                        var: "HW_NAME",
                                        val: "{{.hv_name}}",
                                    },
                                ],
                            },
                            {
                                name: "reboot",
                                image: "ghcr.io/jacobweinstock/waitdaemon:0.2.0",
                                timeout: 90,
                                pid: "host",
                                command: "reboot2",
                                environment: [
                                    {
                                        var: "IMAGE",
                                        val: "alpine",
                                    },
                                    {
                                        var: "WAIT_SECONDS",
                                        val: 10,
                                    },
                                ],
                                volumes: ["/var/run/docker.sock:/var/run/docker.sock"],
                            },
                            {
                                name: "redo",
                                image: "hello-tutum",
                                timeout: 10000,
                                environment: [{ var: "", val: "" }],
                                command: "testing",
                            },
                        ],
                    },
                ],
            },
        },
    },
    {
        id: "ubuntu-focal",
        uid: "2cfdc75a-ee3f-4232-815a-d248c49faba9",
        name: "ubuntu-focal",
        creationTimestamp: new Date("2022-11-25T09:00:33Z"),
        spec: {
            data: {
                tasks: [
                    {
                        name: "a",
                        worker: "",
                        volumes: ["3", "434343"],
                        actions: [
                            {
                                name: "a",
                                image: "b",
                                timeout: 2,
                                command: "aa",
                                environment: [
                                    {
                                        var: "4",
                                        val: "4",
                                    },
                                ],
                            },
                        ],
                        environment: [
                            {
                                var: "1",
                                val: "2",
                            },
                            {
                                var: "3",
                                val: "3",
                            },
                        ],
                    },
                ],
            },
        },
    },
];
export const hardware: THardware[] = [
    {
        id: "node-0cb815afc460",
        uid: "887f9afd-8bf5-4cfa-8e5b-8e3763bee19c",
        name: "node-0cb815afc460",
        creationTimestamp: new Date("2023-09-21T13:27:11Z"),
        spec: {
            interfaces: [
                {
                    dhcp: {
                        arch: "x86_64",
                        hostname: "sm01",
                        ip: {
                            address: "127.0.0.5",
                            gateway: "127.0.0.1",
                            netmask: "255.255.255.0",
                        },
                        lease_time: 86400,
                        mac: "0c:b8:15:af:c4:60",
                        name_servers: ["1.1.1.1"],
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: false,
                        allowWorkflow: false,
                    },
                },
            ],
            metadata: {
                facility: {
                    facility_code: "",
                },
            },
            disks: [],
        },
        sw_raid: false,
    },
    {
        id: "node-502cc6c065c9",
        uid: "aa4517cb-f1cb-49d7-8251-96c395cb78b1",
        name: "node-502cc6c065c9",
        creationTimestamp: new Date("2023-09-21T11:21:25Z"),
        spec: {
            interfaces: [
                {
                    dhcp: {
                        arch: "x86_64",
                        hostname: "sm01",
                        ip: {
                            address: "127.0.0.5",
                            gateway: "127.0.0.1",
                            netmask: "255.255.255.0",
                        },
                        lease_time: 86400,
                        mac: "50:2c:c6:c0:65:c9",
                        name_servers: ["1.1.1.1"],
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: false,
                        allowWorkflow: false,
                    },
                },
            ],
        },
        sw_raid: false,
    },
    {
        id: "node-deadc0decafe",
        uid: "db3ff19b-a382-40e2-94bf-eef60a7db93b",
        name: "node-deadc0decafe",
        creationTimestamp: new Date("2023-09-25T12:52:45Z"),
        spec: {
            interfaces: [
                {
                    dhcp: {
                        arch: "x86_64",
                        hostname: "sm01",
                        ip: {
                            address: "127.0.0.5",
                            gateway: "127.0.0.1",
                            netmask: "255.255.255.0",
                        },
                        lease_time: 86400,
                        mac: "de:ad:c0:de:ca:fe",
                        name_servers: ["1.1.1.1"],
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: false,
                        allowWorkflow: false,
                    },
                },
            ],
        },
        sw_raid: false,
    },
    {
        id: "test-hw",
        uid: "8a5d0e22-eb50-4676-9e2c-344e66cbab4d",
        name: "test-hw",
        creationTimestamp: new Date("2024-07-11T17:15:08Z"),
        spec: {
            disks: [
                {
                    device: "/dev/sda",
                },
                {
                    device: "/dev/sdb",
                },
            ],
            interfaces: [
                {
                    dhcp: {
                        hostname: "test-hw",
                        ip: {
                            address: "10.10.10.2",
                            gateway: "10.10.10.1",
                            netmask: "255.255.255.0",
                        },
                        mac: "aa:bb:cc:dd:ee:ff",
                        name_servers: ["1.1.1.1"],
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: false,
                        allowWorkflow: false,
                    },
                },
            ],
        },
        sw_raid: true,
    },
    {
        id: "node-d401c3078abf",
        uid: "82b08eff-ab94-42a7-839d-746630fd1349",
        name: "node-d401c3078abf",
        creationTimestamp: new Date("2024-08-22T07:11:19Z"),
        spec: {
            disks: [
                {
                    device: "/dev/sda",
                },
            ],
            interfaces: [
                {
                    dhcp: {
                        arch: "x86_64",
                        hostname: "sm01",
                        ip: {
                            address: "127.0.0.5",
                            gateway: "127.0.0.1",
                            netmask: "255.255.255.0",
                        },
                        lease_time: 86400,
                        mac: "d4:01:c3:07:8a:bf",
                        name_servers: ["1.1.1.1"],
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: false,
                        allowWorkflow: false,
                        ipxe: {},
                    },
                },
            ],
            metadata: {
                facility: {
                    facility_code: "onprem",
                },
                instance: {
                    hostname: "node-d401c3078abf",
                    id: "node-d401c3078abf",
                    operating_system: {},
                },
            },
        },
        sw_raid: false,
    },
    {
        id: "node-d401c3078ac0",
        uid: "8674f916-f21b-4feb-bc1f-b33c87512253",
        name: "node-d401c3078ac0",
        creationTimestamp: new Date("2024-08-22T07:11:19Z"),
        spec: {
            disks: [
                {
                    device: "/dev/sda",
                },
            ],
            interfaces: [
                {
                    dhcp: {
                        arch: "x86_64",
                        hostname: "sm01",
                        ip: {
                            address: "127.0.0.5",
                            gateway: "127.0.0.1",
                            netmask: "255.255.255.0",
                        },
                        lease_time: 86400,
                        mac: "d4:01:c3:07:8a:c0",
                        name_servers: ["1.1.1.1"],
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: false,
                        allowWorkflow: false,
                        ipxe: {},
                    },
                },
            ],
            metadata: {
                facility: {
                    facility_code: "onprem",
                },
                instance: {
                    hostname: "node-d401c3078ac0",
                    id: "node-d401c3078ac0",
                    operating_system: {},
                },
            },
        },
        sw_raid: false,
    },
    {
        id: "node-16dd7f53c0e9",
        uid: "7b19fa9c-9cb4-444b-a6ba-117958955148",
        name: "node-16dd7f53c0e9",
        creationTimestamp: new Date("2024-08-22T12:50:40Z"),
        spec: {
            disks: [
                {
                    device: "/dev/sda",
                },
            ],
            interfaces: [
                {
                    dhcp: {
                        arch: "x86_64",
                        hostname: "sm01",
                        ip: {
                            address: "127.0.0.5",
                            gateway: "127.0.0.1",
                            netmask: "255.255.255.0",
                        },
                        lease_time: 86400,
                        mac: "16:dd:7f:53:c0:e9",
                        name_servers: ["1.1.1.1"],
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: false,
                        allowWorkflow: false,
                        ipxe: {},
                    },
                },
            ],
            metadata: {
                facility: {
                    facility_code: "onprem",
                },
                instance: {
                    hostname: "node-16dd7f53c0e9",
                    id: "node-16dd7f53c0e9",
                    operating_system: {},
                },
            },
        },
        sw_raid: false,
    },
    {
        id: "node-12bc872551bb",
        uid: "5064c768-90f7-4da0-b64e-5eb0d1987b03",
        name: "node-12bc872551bb",
        creationTimestamp: new Date("2024-08-22T12:52:55Z"),
        spec: {
            disks: [
                {
                    device: "/dev/sda",
                },
            ],
            interfaces: [
                {
                    dhcp: {
                        arch: "x86_64",
                        hostname: "sm01",
                        ip: {
                            address: "127.0.0.5",
                            gateway: "127.0.0.1",
                            netmask: "255.255.255.0",
                        },
                        lease_time: 86400,
                        mac: "12:bc:87:25:51:bb",
                        name_servers: ["1.1.1.1"],
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: false,
                        allowWorkflow: false,
                        ipxe: {},
                    },
                },
            ],
            metadata: {
                facility: {
                    facility_code: "onprem",
                },
                instance: {
                    hostname: "node-12bc872551bb",
                    id: "node-12bc872551bb",
                    operating_system: {},
                },
            },
        },
        sw_raid: false,
    },
    {
        id: "node-b04a399eb03a",
        uid: "fef2457e-f07a-4740-9c3d-fc44cd20bf48",
        name: "node-b04a399eb03a",
        creationTimestamp: new Date("2024-08-22T15:13:23Z"),
        spec: {
            disks: [
                {
                    device: "/dev/sda",
                },
            ],
            interfaces: [
                {
                    dhcp: {
                        arch: "x86_64",
                        hostname: "sm01",
                        ip: {
                            address: "127.0.0.5",
                            gateway: "127.0.0.1",
                            netmask: "255.255.255.0",
                        },
                        lease_time: 86400,
                        mac: "b0:4a:39:9e:b0:3a",
                        name_servers: ["1.1.1.1"],
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: false,
                        allowWorkflow: false,
                        ipxe: {},
                    },
                },
            ],
            metadata: {
                facility: {
                    facility_code: "onprem",
                },
                instance: {
                    hostname: "node-b04a399eb03a",
                    id: "node-b04a399eb03a",
                    operating_system: {},
                },
            },
        },
        sw_raid: false,
    },
    {
        id: "node-6cadf8d22550",
        uid: "05b51a90-a34e-41a0-a8aa-78cd378145d4",
        name: "node-6cadf8d22550",
        creationTimestamp: new Date("2024-08-23T01:18:31Z"),
        spec: {
            disks: [
                {
                    device: "/dev/sda",
                },
            ],
            interfaces: [
                {
                    dhcp: {
                        arch: "x86_64",
                        hostname: "sm01",
                        ip: {
                            address: "127.0.0.5",
                            gateway: "127.0.0.1",
                            netmask: "255.255.255.0",
                        },
                        lease_time: 86400,
                        mac: "6c:ad:f8:d2:25:50",
                        name_servers: ["1.1.1.1"],
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: false,
                        allowWorkflow: false,
                        ipxe: {},
                    },
                },
            ],
            metadata: {
                facility: {
                    facility_code: "onprem",
                },
                instance: {
                    hostname: "node-6cadf8d22550",
                    id: "node-6cadf8d22550",
                    operating_system: {},
                },
            },
        },
        sw_raid: false,
    },
    {
        id: "node-525400f2ed9c",
        uid: "893d5369-57cf-49cd-a5d0-63ed1915005a",
        name: "node-525400f2ed9c",
        creationTimestamp: new Date("2023-10-25T12:18:37Z"),
        spec: {
            disks: [
                {
                    device: "/dev/md0",
                },
                {
                    device: "/dev/vda",
                },
                {
                    device: "/dev/vdb",
                },
            ],
            interfaces: [
                {
                    dhcp: {
                        arch: "x86_64",
                        hostname: "sm01",
                        ip: {
                            address: "192.168.123.144",
                            gateway: "192.168.123.1",
                            netmask: "255.255.255.0",
                        },
                        lease_time: 86400,
                        mac: "52:54:00:f2:ed:9c",
                        name_servers: ["1.1.1.1"],
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: false,
                        allowWorkflow: true,
                        ipxe: {},
                    },
                },
            ],
            metadata: {
                facility: {
                    facility_code: "onprem",
                },
                instance: {
                    hostname: "node-525400f2ed9c",
                    id: "node-525400f2ed9c",
                    operating_system: {},
                },
            },
        },
        sw_raid: false,
    },
    {
        id: "node-08e9f6154de0",
        uid: "8e577841-f5de-47a7-8be0-c1f1987fb522",
        name: "node-08e9f6154de0",
        creationTimestamp: new Date("2024-08-24T21:23:52Z"),
        spec: {
            disks: [
                {
                    device: "/dev/sda",
                },
            ],
            interfaces: [
                {
                    dhcp: {
                        arch: "x86_64",
                        hostname: "sm01",
                        ip: {
                            address: "127.0.0.5",
                            gateway: "127.0.0.1",
                            netmask: "255.255.255.0",
                        },
                        lease_time: 86400,
                        mac: "08:e9:f6:15:4d:e0",
                        name_servers: ["1.1.1.1"],
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: false,
                        allowWorkflow: false,
                        ipxe: {},
                    },
                },
            ],
            metadata: {
                facility: {
                    facility_code: "onprem",
                },
                instance: {
                    hostname: "node-08e9f6154de0",
                    id: "node-08e9f6154de0",
                    operating_system: {},
                },
            },
        },
        sw_raid: false,
    },
    {
        id: "node-a0c589b69a2c",
        uid: "035e6319-da51-4b84-8e3e-2247987cbd79",
        name: "node-a0c589b69a2c",
        creationTimestamp: new Date("2024-08-25T09:41:07Z"),
        spec: {
            disks: [
                {
                    device: "/dev/sda",
                },
            ],
            interfaces: [
                {
                    dhcp: {
                        arch: "x86_64",
                        hostname: "sm01",
                        ip: {
                            address: "127.0.0.5",
                            gateway: "127.0.0.1",
                            netmask: "255.255.255.0",
                        },
                        lease_time: 86400,
                        mac: "a0:c5:89:b6:9a:2c",
                        name_servers: ["1.1.1.1"],
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: false,
                        allowWorkflow: false,
                        ipxe: {},
                    },
                },
            ],
            metadata: {
                facility: {
                    facility_code: "onprem",
                },
                instance: {
                    hostname: "node-a0c589b69a2c",
                    id: "node-a0c589b69a2c",
                    operating_system: {},
                },
            },
        },
        sw_raid: false,
    },
    {
        id: "node-40ca632a485d",
        uid: "b50f6a58-cd61-44b0-bf46-d4d072733381",
        name: "node-40ca632a485d",
        creationTimestamp: new Date("2024-08-26T07:05:28Z"),
        spec: {
            disks: [
                {
                    device: "/dev/sda",
                },
            ],
            interfaces: [
                {
                    dhcp: {
                        arch: "x86_64",
                        hostname: "sm01",
                        ip: {
                            address: "127.0.0.5",
                            gateway: "127.0.0.1",
                            netmask: "255.255.255.0",
                        },
                        lease_time: 86400,
                        mac: "40:ca:63:2a:48:5d",
                        name_servers: ["1.1.1.1"],
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: false,
                        allowWorkflow: false,
                        ipxe: {},
                    },
                },
            ],
            metadata: {
                facility: {
                    facility_code: "onprem",
                },
                instance: {
                    hostname: "node-40ca632a485d",
                    id: "node-40ca632a485d",
                    operating_system: {},
                },
            },
        },
        sw_raid: false,
    },
    {
        id: "node-683a4823761e",
        uid: "a99ccba5-f31d-45fd-b1bf-80ec86097a2e",
        name: "node-683a4823761e",
        creationTimestamp: new Date("2024-08-26T07:05:28Z"),
        spec: {
            disks: [
                {
                    device: "/dev/sda",
                },
            ],
            interfaces: [
                {
                    dhcp: {
                        arch: "x86_64",
                        hostname: "sm01",
                        ip: {
                            address: "127.0.0.5",
                            gateway: "127.0.0.1",
                            netmask: "255.255.255.0",
                        },
                        lease_time: 86400,
                        mac: "68:3a:48:23:76:1e",
                        name_servers: ["1.1.1.1"],
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: false,
                        allowWorkflow: false,
                        ipxe: {},
                    },
                },
            ],
            metadata: {
                facility: {
                    facility_code: "onprem",
                },
                instance: {
                    hostname: "node-683a4823761e",
                    id: "node-683a4823761e",
                    operating_system: {},
                },
            },
        },
        sw_raid: false,
    },
    {
        id: "node-84f703c2398c",
        uid: "ef832dde-e4fa-4c41-9082-78bf2eeaec28",
        name: "node-84f703c2398c",
        creationTimestamp: new Date("2024-08-26T07:05:31Z"),
        spec: {
            disks: [
                {
                    device: "/dev/sda",
                },
            ],
            interfaces: [
                {
                    dhcp: {
                        arch: "x86_64",
                        hostname: "sm01",
                        ip: {
                            address: "127.0.0.5",
                            gateway: "127.0.0.1",
                            netmask: "255.255.255.0",
                        },
                        lease_time: 86400,
                        mac: "84:f7:03:c2:39:8c",
                        name_servers: ["1.1.1.1"],
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: false,
                        allowWorkflow: false,
                        ipxe: {},
                    },
                },
            ],
            metadata: {
                facility: {
                    facility_code: "onprem",
                },
                instance: {
                    hostname: "node-84f703c2398c",
                    id: "node-84f703c2398c",
                    operating_system: {},
                },
            },
        },
        sw_raid: false,
    },
    {
        id: "node-30c6f78b9a40",
        uid: "0e710517-53f7-4910-9c9d-df3ef3d04126",
        name: "node-30c6f78b9a40",
        creationTimestamp: new Date("2024-08-26T07:06:56Z"),
        spec: {
            disks: [
                {
                    device: "/dev/sda",
                },
            ],
            interfaces: [
                {
                    dhcp: {
                        arch: "x86_64",
                        hostname: "sm01",
                        ip: {
                            address: "127.0.0.5",
                            gateway: "127.0.0.1",
                            netmask: "255.255.255.0",
                        },
                        lease_time: 86400,
                        mac: "30:c6:f7:8b:9a:40",
                        name_servers: ["1.1.1.1"],
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: false,
                        allowWorkflow: false,
                        ipxe: {},
                    },
                },
            ],
            metadata: {
                facility: {
                    facility_code: "onprem",
                },
                instance: {
                    hostname: "node-30c6f78b9a40",
                    id: "node-30c6f78b9a40",
                    operating_system: {},
                },
            },
        },
        sw_raid: false,
    },
    {
        id: "node-508bb9fc160b",
        uid: "8c167682-d2cc-480c-8b2e-fd2e1ce3f642",
        name: "node-508bb9fc160b",
        creationTimestamp: new Date("2024-08-26T07:07:06Z"),
        spec: {
            disks: [
                {
                    device: "/dev/sda",
                },
            ],
            interfaces: [
                {
                    dhcp: {
                        arch: "x86_64",
                        hostname: "sm01",
                        ip: {
                            address: "127.0.0.5",
                            gateway: "127.0.0.1",
                            netmask: "255.255.255.0",
                        },
                        lease_time: 86400,
                        mac: "50:8b:b9:fc:16:0b",
                        name_servers: ["1.1.1.1"],
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: false,
                        allowWorkflow: false,
                        ipxe: {},
                    },
                },
            ],
            metadata: {
                facility: {
                    facility_code: "onprem",
                },
                instance: {
                    hostname: "node-508bb9fc160b",
                    id: "node-508bb9fc160b",
                    operating_system: {},
                },
            },
        },
        sw_raid: false,
    },
    {
        id: "node-bcd07443b8aa",
        uid: "e6dc6602-e44d-44f4-8d5a-5ea10fe81fc2",
        name: "node-bcd07443b8aa",
        creationTimestamp: new Date("2024-08-27T07:26:28Z"),
        spec: {
            disks: [
                {
                    device: "/dev/sda",
                },
            ],
            interfaces: [
                {
                    dhcp: {
                        arch: "x86_64",
                        hostname: "sm01",
                        ip: {
                            address: "127.0.0.5",
                            gateway: "127.0.0.1",
                            netmask: "255.255.255.0",
                        },
                        lease_time: 86400,
                        mac: "bc:d0:74:43:b8:aa",
                        name_servers: ["1.1.1.1"],
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: false,
                        allowWorkflow: false,
                        ipxe: {},
                    },
                },
            ],
            metadata: {
                facility: {
                    facility_code: "onprem",
                },
                instance: {
                    hostname: "node-bcd07443b8aa",
                    id: "node-bcd07443b8aa",
                    operating_system: {},
                },
            },
        },
        sw_raid: false,
    },
    {
        id: "node-ce22025abce8",
        uid: "ff103f1a-dca3-47e6-ab09-cb98dcba12c7",
        name: "node-ce22025abce8",
        creationTimestamp: new Date("2024-08-27T07:33:03Z"),
        spec: {
            disks: [
                {
                    device: "/dev/sda",
                },
            ],
            interfaces: [
                {
                    dhcp: {
                        arch: "x86_64",
                        hostname: "sm01",
                        ip: {
                            address: "127.0.0.5",
                            gateway: "127.0.0.1",
                            netmask: "255.255.255.0",
                        },
                        lease_time: 86400,
                        mac: "ce:22:02:5a:bc:e8",
                        name_servers: ["1.1.1.1"],
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: false,
                        allowWorkflow: false,
                        ipxe: {},
                    },
                },
            ],
            metadata: {
                facility: {
                    facility_code: "onprem",
                },
                instance: {
                    hostname: "node-ce22025abce8",
                    id: "node-ce22025abce8",
                    operating_system: {},
                },
            },
        },
        sw_raid: false,
    },
    {
        id: "node-784f4368ce1f",
        uid: "b56bc042-e7b1-4356-82da-f83a71c6ea70",
        name: "node-784f4368ce1f",
        creationTimestamp: new Date("2024-08-27T07:40:05Z"),
        spec: {
            disks: [
                {
                    device: "/dev/sda",
                },
            ],
            interfaces: [
                {
                    dhcp: {
                        arch: "x86_64",
                        hostname: "sm01",
                        ip: {
                            address: "127.0.0.5",
                            gateway: "127.0.0.1",
                            netmask: "255.255.255.0",
                        },
                        lease_time: 86400,
                        mac: "78:4f:43:68:ce:1f",
                        name_servers: ["1.1.1.1"],
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: false,
                        allowWorkflow: false,
                        ipxe: {},
                    },
                },
            ],
            metadata: {
                facility: {
                    facility_code: "onprem",
                },
                instance: {
                    hostname: "node-784f4368ce1f",
                    id: "node-784f4368ce1f",
                    operating_system: {},
                },
            },
        },
        sw_raid: false,
    },
    {
        id: "node-5254008aacc3",
        uid: "1ec01c07-e08b-4f7f-9d34-810f6f295e93",
        name: "node-5254008aacc3",
        creationTimestamp: new Date("2024-08-22T07:11:33Z"),
        spec: {
            interfaces: [
                {
                    dhcp: {
                        hostname: "a",
                        ip: {
                            address: "192.168.1.1",
                            gateway: "192.168.1.1",
                            netmask: "192.168.1.1",
                        },
                        mac: "aa:bb:cc:dd:ee:ff",
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: true,
                        allowWorkflow: true,
                    },
                },
            ],
        },
        sw_raid: false,
    },
    {
        id: "node-beeccde417d5",
        uid: "4d363db4-f648-4201-adee-5054845c5d71",
        name: "node-beeccde417d5",
        creationTimestamp: new Date("2024-08-27T07:42:51Z"),
        spec: {
            disks: [
                {
                    device: "/dev/sda",
                },
            ],
            interfaces: [
                {
                    dhcp: {
                        arch: "x86_64",
                        hostname: "sm01",
                        ip: {
                            address: "127.0.0.5",
                            gateway: "127.0.0.1",
                            netmask: "255.255.255.0",
                        },
                        lease_time: 86400,
                        mac: "be:ec:cd:e4:17:d5",
                        name_servers: ["1.1.1.1"],
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: false,
                        allowWorkflow: false,
                        ipxe: {},
                    },
                },
                {
                    dhcp: {
                        hostname: "aaaa",
                        ip: {
                            address: "127.0.0.5",
                            gateway: "127.0.0.5",
                            netmask: "127.0.0.5",
                        },
                        mac: "be:ec:cd:e4:17:d5",
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: false,
                        allowWorkflow: false,
                    },
                },
            ],
            metadata: {
                facility: {
                    facility_code: "onprem",
                },
                instance: {
                    hostname: "node-beeccde417d5",
                    id: "node-beeccde417d5",
                    operating_system: {},
                },
            },
        },
        sw_raid: false,
    },
    {
        id: "hardware-238",
        uid: "892bcc6d-2d33-43dc-970a-c8b810688f18",
        name: "hardware-238",
        creationTimestamp: new Date("2024-10-09T17:18:51Z"),
        spec: {
            interfaces: [
                {
                    dhcp: {
                        hostname: "hardware-238",
                        ip: {
                            address: "192.168.1.1",
                            gateway: "192.168.1.1",
                            netmask: "255.255.255.0",
                        },
                        mac: "aa:bb:cc:dd:ee:ff",
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: true,
                        allowWorkflow: false,
                    },
                },
            ],
        },
        sw_raid: false,
    },
    {
        id: "hardware-5",
        uid: "437b65c6-4c64-46d4-9a04-26196503b51d",
        name: "hardware-5",
        creationTimestamp: new Date("2024-10-09T17:23:44Z"),
        spec: {
            interfaces: [
                {
                    dhcp: {
                        hostname: "hardware-5",
                        ip: {
                            address: "192.168.1.1",
                            gateway: "192.168.1.1",
                            netmask: "255.255.255.0",
                        },
                        mac: "aa:bb:cc:dd:ee:ff",
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: true,
                        allowWorkflow: false,
                    },
                },
            ],
        },
        sw_raid: false,
    },
    {
        id: "hardware-68",
        uid: "086349d2-872d-4d5d-9756-79758e57a0d0",
        name: "hardware-68",
        creationTimestamp: new Date("2024-10-09T17:23:58Z"),
        spec: {
            interfaces: [
                {
                    dhcp: {
                        hostname: "hardware-68",
                        ip: {
                            address: "192.168.1.1",
                            gateway: "192.168.1.1",
                            netmask: "255.255.255.0",
                        },
                        mac: "aa:bb:cc:dd:ee:ff",
                        uefi: false,
                    },
                    netboot: {
                        allowPXE: true,
                        allowWorkflow: false,
                    },
                },
            ],
        },
        sw_raid: false,
    },
];
