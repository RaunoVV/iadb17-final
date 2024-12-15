import { useForm } from "@refinedev/react-hook-form";
import { Create } from "@refinedev/mui";

import {FormProvider} from "react-hook-form";

import type React from "react";

import { HardwareForm } from "../../components/Hardware/Form.tsx";

import type { HttpError } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { hardwareSchema, type THardware } from "shared/types/Hardware";

export const CreateHardware = () => {
    const randomId = Math.round(Math.random() * 100);
    const defaultInterfaceValue = {
        dhcp: {
            hostname: `hardware-${randomId}`,
            mac: "aa:bb:cc:dd:ee:ff",
            ip: {
                address: "192.168.1.1",
                netmask: "255.255.255.0",
                gateway: "192.168.1.1",
            },
            uefi: false,
        },
    };
    const methods = useForm<THardware, HttpError, THardware>({
        defaultValues: {
            name: `hardware-${randomId}`,
            spec: {
                interfaces: [defaultInterfaceValue],
            },
        },
        refineCoreProps: {redirect: "list"},
        resolver: zodResolver(hardwareSchema),
    });
    const {
        saveButtonProps,
        refineCore: {formLoading},
    } = methods;

    return (
        <Create
            isLoading={formLoading}
            saveButtonProps={{
                ...saveButtonProps,
                // onClick: handleSubmit(handleSubmitForm),
            }}
        >
            <FormProvider {...methods}>
                <HardwareForm action="create" defaultInterfaceValue={defaultInterfaceValue}/>
            </FormProvider>
        </Create>
    );
};
