import { Box, Button, TextField, Typography } from "@mui/material";
import { Task } from "./Task";
import {
	useFieldArray,
	type UseFieldArrayRemove,
	useFormContext,
} from "react-hook-form";
import React from "react";
// @ts-ignore
import PropTypes from "prop-types";
import Collapsible from "react-collapsible";
import { DeleteButton } from "@refinedev/mui";
import type { TTemplate, TTemplateTask } from "shared/types/Template";
const CollapsibeTrigger = (props: {
	removeTask: UseFieldArrayRemove;
	index: number;
}) => {
	return (
		<Box alignItems="center" display="flex">
			Task {props.index + 1}
			<DeleteButton
				hideText
				onClick={(e) => {
					e.stopPropagation();
					props.removeTask(props.index);
				}}
			>
				Delete
			</DeleteButton>
		</Box>
	);
};
export const TemplateForm = ({ action = "create" }: { action: string }) => {
	const defaultTaskValue: TTemplateTask = {
		name: "",
		environment: [{ var: "", val: "" }],
		worker: "",
		volumes: [],
		actions: [],
	};
	const {
		register,
		control,
		formState: { errors },
	} = useFormContext<TTemplate>();

	const {
		fields: tasks,
		append: appendTask,
		remove: removeTask,
	} = useFieldArray({
		name: "spec.data.tasks",
		control,
	});

	return (
		<Box
			component="form"
			sx={{ display: "flex", flexDirection: "column" }}
			autoComplete="off"
		>
			<TextField
				{...register("name")}
				error={!!errors?.name}
				helperText={errors.name && `${errors.name.message}`}
				margin="normal"
				fullWidth
				InputLabelProps={{ shrink: true }}
				type="text"
				label="Name"
				name="id"
				disabled={action === "edit"}
			/>
			<Typography className="form-subtitle-1">Tasks</Typography>
			{tasks.map((task, index) => (
				<Collapsible
					open={index === 0}
					key={task.id}
					trigger={<CollapsibeTrigger index={index} removeTask={removeTask} />}
				>
					<Task index={index} />
				</Collapsible>
			))}
			<Button onClick={() => appendTask(defaultTaskValue)}>Add Task</Button>
		</Box>
	);
};
