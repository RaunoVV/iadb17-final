import { useForm } from "@refinedev/react-hook-form";
import { Edit } from "@refinedev/mui";

import { FormProvider } from "react-hook-form";

import type React from "react";
import type { Key } from "react";

import { HardwareForm } from "../../components/Hardware/Form.tsx";

import type { HttpError } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { hardwareSchema, type THardware } from "shared/types/Hardware";

interface InterfaceProps {
	id: Key;
	index: number;
	data: Record<number, string>;
}

export const EditHardware = () => {
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
				interfaces: [],
			},
		},
		refineCoreProps: { redirect: "list" },
		resolver: zodResolver(hardwareSchema),
	});
	const {
		saveButtonProps,
		refineCore: { formLoading, onFinish },
		handleSubmit,
	} = methods;

	return (
		<Edit
			isLoading={formLoading}
			saveButtonProps={{
				...saveButtonProps,
				// onClick: handleSubmit(handleSubmitForm),
			}}
		>
			<FormProvider {...methods}>
				<HardwareForm
					action="create"
					defaultInterfaceValue={defaultInterfaceValue}
				/>
			</FormProvider>
		</Edit>
	);
};
