import type React from "react";
import { DeleteButton, EditButton, type EditButtonProps } from "@refinedev/mui";
import { Box } from "@mui/material";

export const GridActions = (props: EditButtonProps) => {
	return (
		<Box sx={{ "div:has(> .refine-delete-button)": { display: "inline" } }}>
			<EditButton {...props} />
			<DeleteButton {...props} />
		</Box>
	);
};
