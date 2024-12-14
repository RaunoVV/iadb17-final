import React, { type ReactElement } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Box, Button, Divider, FormControl, Paper, Stack, TextField, Typography } from "@mui/material";
import { DeleteButton } from "@refinedev/mui";
import { string } from "zod";
import type { TTemplate, TTemplateEnvvar } from "shared/types/Template";
import { TemplateAction } from "./Action.tsx";

export const Task = (props: { index: number }): ReactElement => {
    const {
        register,
        control,
        watch,
        formState: { errors },
        setValue,
    } = useFormContext<TTemplate>();

    const {
        fields: envVars,
        append: appendEnvVars,
        remove: removeEnvVars,
    } = useFieldArray({
        name: `spec.data.tasks.${props.index}.environment`,
        control,
    });
    const defaultEnvVar: TTemplateEnvvar = {
        var: "",
        val: "",
    };
    // const { remove: removeTask } = useFieldArray({
    // 	name: `spec.data.tasks.${props.index}`,
    // 	control,
    // });

    const {
        fields: actions,
        append: appendAction,
        remove: removeAction,
    } = useFieldArray({
        name: `spec.data.tasks.${props.index}.actions`,
        control,
    });

    const volumes = watch(`spec.data.tasks.${props.index}.volumes`, new Array<string>());

    function appendVolume() {
        setValue(`spec.data.tasks.${props.index}.volumes.${volumes.length}`, "");
    }
    function removeVolume(index: number) {
        volumes.splice(index, 1);
        setValue(`spec.data.tasks.${props.index}.volumes`, volumes);
    }

    console.log(errors);
    return (
        <Box>
            <TextField
                {...register(`spec.data.tasks.${props.index}.name` as const)}
                error={!!errors?.spec?.data?.tasks?.[props.index]?.name}
                helperText={
                    errors?.spec?.data?.tasks?.[props.index]?.name &&
                    `${errors?.spec?.data?.tasks?.[props.index]?.name?.message}`
                }
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }}
                type="text"
                label="name"
            />
            <TextField
                {...register(`spec.data.tasks.${props.index}.worker` as const)}
                error={!!errors?.spec?.data?.tasks?.[props.index]?.worker}
                helperText={
                    errors?.spec?.data?.tasks?.[props.index]?.worker &&
                    `${errors?.spec?.data?.tasks?.[props.index]?.worker?.message}`
                }
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }}
                type="text"
                label="worker"
            />
            {/*Envvars*/}

            <Typography className="form-subtitle-1">Environment variables</Typography>
            <Box paddingLeft="10px">
                {envVars.map((envVar: TTemplateEnvvar, envIndex) => (
                    <Stack key={envIndex} spacing={2} direction="row" alignItems="center" marginTop="15px">
                        <TextField
                            {...register(`spec.data.tasks.${props.index}.environment.${envIndex}.var` as const)}
                            error={!!errors?.spec?.data?.tasks?.[props.index]?.environment?.[envIndex]?.var}
                            helperText={
                                errors?.spec?.data?.tasks?.[props.index]?.environment?.[envIndex]?.var &&
                                `${errors?.spec?.data?.tasks?.[props.index]?.environment?.[envIndex]?.var?.message}`
                            }
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            type="text"
                            label="var"
                            fullWidth
                        />
                        <TextField
                            {...register(`spec.data.tasks.${props.index}.environment.${envIndex}.val` as const)}
                            error={!!errors?.spec?.data?.tasks?.[props.index]?.environment?.[envIndex]?.val}
                            helperText={
                                errors?.spec?.data?.tasks?.[props.index]?.environment?.[envIndex]?.val &&
                                `${errors?.spec?.data?.tasks?.[props.index]?.environment?.[envIndex]?.val?.message}`
                            }
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            type="text"
                            label="val"
                            fullWidth
                        />
                        <DeleteButton hideText onClick={() => removeEnvVars(envIndex)} />
                    </Stack>
                ))}
                <Button onClick={() => appendEnvVars(defaultEnvVar)}>Add Variable</Button>
            </Box>
            {/*Envvars*/}
            {/*Volumes*/}
            <Typography className="form-subtitle-1">Volumes</Typography>
            <Box paddingLeft="10px">
                {volumes.map((volume: string, volIndex: number) => (
                    <Box key={volIndex} display="flex" alignItems="center">
                        <TextField
                            {...register(`spec.data.tasks.${props.index}.volumes.${volIndex}` as const)}
                            error={!!errors?.spec?.data?.tasks?.[props.index]?.volumes?.[volIndex]}
                            helperText={
                                errors?.spec?.data?.tasks?.[props.index]?.volumes?.[volIndex] &&
                                `${errors?.spec?.data?.tasks?.[props.index]?.volumes?.[volIndex]?.message}`
                            }
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            type="text"
                            label="Volume"
                            fullWidth
                            value={volume}
                        />

                        <DeleteButton hideText onClick={() => removeVolume(volIndex)} />
                    </Box>
                ))}
                <Button onClick={() => appendVolume()}>Add Volume</Button>
            </Box>

            {/*Volumes*/}
            {/*Actions*/}

            <Typography className="form-subtitle-1">Actions</Typography>
            <Box paddingLeft="10px">
                {actions.map((action, actionIndex) => (
                    <TemplateAction
                        key={action.id}
                        actionIndex={actionIndex}
                        taskIndex={props.index}
                        removeAction={removeAction}
                    />
                ))}
                <Button
                    onClick={() =>
                        appendAction({
                            name: "name",
                            image: "",
                            environment: [],
                            timeout: 60,
                        })
                    }
                >
                    Add Action
                </Button>
            </Box>
        </Box>
    );
};
