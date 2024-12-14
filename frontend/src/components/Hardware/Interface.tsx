import {
	FormControlLabel,
	FormGroup,
	TextField,
	Typography,
} from "@mui/material";
import { DeleteButton } from "@refinedev/mui";
import React, { type Key } from "react";
import { type UseFieldArrayRemove, useFormContext } from "react-hook-form";
import type { THardware } from "shared/types/Hardware";

interface InterfaceProps {
	id: Key;
	index: number;
	data: Record<number, string>;
}

export const HardwareInterface = (props: InterfaceProps) => {
	const {
		register,
		formState: { errors },
	} = useFormContext<THardware>();

	return (
		<FormGroup>
			<Typography variant="h6">Interface #{props.index + 1}</Typography>
			<TextField
				{...register(`spec.interfaces.${props.index}.dhcp.hostname` as const)}
				error={!!errors?.spec?.interfaces?.[props.index]?.dhcp?.hostname}
				helperText={
					errors?.spec?.interfaces?.[props.index]?.dhcp?.hostname &&
					`${errors?.spec?.interfaces?.[props.index]?.dhcp?.hostname?.message}`
				}
				margin="normal"
				fullWidth
				InputLabelProps={{ shrink: true }}
				type="text"
				label="Hostname"
			/>

			<TextField
				{...register(`spec.interfaces.${props.index}.dhcp.mac` as const)}
				error={!!errors?.spec?.interfaces?.[props.index]?.dhcp?.mac}
				helperText={
					errors?.spec?.interfaces?.[props.index]?.dhcp?.mac &&
					`${errors?.spec?.interfaces?.[props.index]?.dhcp?.mac?.message}`
				}
				margin="normal"
				fullWidth
				InputLabelProps={{ shrink: true }}
				type="text"
				label="MAC"
			/>
			<TextField
				{...register(`spec.interfaces.${props.index}.dhcp.ip.address` as const)}
				error={!!errors?.spec?.interfaces?.[props.index]?.dhcp?.ip?.address}
				helperText={
					errors?.spec?.interfaces?.[props.index]?.dhcp?.ip?.address &&
					`${errors?.spec?.interfaces?.[props.index]?.dhcp?.ip?.address?.message}`
				}
				margin="normal"
				fullWidth
				InputLabelProps={{ shrink: true }}
				type="text"
				label="Address"
			/>
			<TextField
				{...register(`spec.interfaces.${props.index}.dhcp.ip.netmask` as const)}
				error={!!errors?.spec?.interfaces?.[props.index]?.dhcp?.ip?.netmask}
				helperText={
					errors?.spec?.interfaces?.[props.index]?.dhcp?.ip?.netmask &&
					`${errors?.spec?.interfaces?.[props.index]?.dhcp?.ip?.netmask?.message}`
				}
				margin="normal"
				fullWidth
				InputLabelProps={{ shrink: true }}
				type="text"
				label="Netmask"
			/>
			<TextField
				{...register(`spec.interfaces.${props.index}.dhcp.ip.gateway` as const)}
				error={!!errors?.spec?.interfaces?.[props.index]?.dhcp?.ip?.gateway}
				helperText={
					errors?.spec?.interfaces?.[props.index]?.dhcp?.ip?.gateway &&
					`${errors?.spec?.interfaces?.[props.index]?.dhcp?.ip?.gateway?.message}`
				}
				margin="normal"
				fullWidth
				InputLabelProps={{ shrink: true }}
				type="text"
			/>

			<FormControlLabel
				control={
					<input
						type="checkbox"
						{...register(`spec.interfaces.${props.index}.dhcp.uefi` as const)}
					/>
				}
				label="UEFI"
			/>

			<FormControlLabel
				control={
					<input
						type="checkbox"
						{...register(
							`spec.interfaces.${props.index}.netboot.allowPXE` as const,
						)}
					/>
				}
				label="Allow Netboot"
			/>
			<FormControlLabel
				control={
					<input
						type="checkbox"
						{...register(
							`spec.interfaces.${props.index}.netboot.allowWorkflow` as const,
						)}
					/>
				}
				label="Allow Workflow"
			/>
		</FormGroup>
	);
};
