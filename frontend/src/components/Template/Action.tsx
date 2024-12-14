import React, { type ReactElement } from "react";
import { useFieldArray, type UseFieldArrayRemove, useFormContext } from "react-hook-form";
import { Box, Button, Divider, FormControl, Paper, Stack, TextField, Typography } from "@mui/material";
import { DeleteButton } from "@refinedev/mui";
import { string } from "zod";
import type { TTemplate, TTemplateEnvvar } from "shared/types/Template";

export const TemplateAction = (props: {
    taskIndex: number;
    actionIndex: number;
    removeAction: UseFieldArrayRemove;
}): ReactElement => {
    const {
        register,
        control,
        watch,
        formState: { errors },
        setValue,
    } = useFormContext<TTemplate>();
    const {
        fields: actionEnvVars,
        append: actionAppendEnvVars,
        remove: actionRemoveEnvVars,
    } = useFieldArray({
        name: `spec.data.tasks.${props.taskIndex}.actions.${props.actionIndex}.environment`,
        control,
    });
    console.log(errors);
    return (
        <Box>
            <Typography className="form-subtitle-2">Action #{props.actionIndex + 1}</Typography>
            <TextField
                {...register(`spec.data.tasks.${props.taskIndex}.actions.${props.actionIndex}.name` as const)}
                error={!!errors?.spec?.data?.tasks?.[props.taskIndex]?.actions?.[props.actionIndex]?.name}
                helperText={
                    errors?.spec?.data?.tasks?.[props.taskIndex]?.actions?.[props.actionIndex]?.name &&
                    `${errors?.spec?.data?.tasks?.[props.taskIndex]?.actions?.[props.actionIndex]?.name?.message}`
                }
                margin="normal"
                InputLabelProps={{ shrink: true }}
                type="text"
                label="Name"
                fullWidth
            />
            <TextField
                {...register(`spec.data.tasks.${props.taskIndex}.actions.${props.actionIndex}.image` as const)}
                error={!!errors?.spec?.data?.tasks?.[props.taskIndex]?.actions?.[props.actionIndex]?.image}
                helperText={
                    errors?.spec?.data?.tasks?.[props.taskIndex]?.actions?.[props.actionIndex]?.image &&
                    `${errors?.spec?.data?.tasks?.[props.taskIndex]?.actions?.[props.actionIndex]?.image?.message}`
                }
                margin="normal"
                InputLabelProps={{ shrink: true }}
                type="text"
                label="Image"
                fullWidth
            />
            {/*Envvars*/}

            <Typography className="form-subtitle-1">Environment variables</Typography>
            <Box paddingLeft="10px">
                {actionEnvVars.map((envVar: TTemplateEnvvar, envIndex) => (
                    <Stack key={envIndex} spacing={2} direction="row" alignItems="center" marginTop="15px">
                        <TextField
                            {...register(
                                `spec.data.tasks.${props.taskIndex}.actions.${props.actionIndex}.environment.${envIndex}.var` as const,
                            )}
                            error={
                                !!errors?.spec?.data?.tasks?.[props.taskIndex]?.actions?.[props.actionIndex]
                                    ?.environment?.[envIndex]?.var
                            }
                            helperText={
                                errors?.spec?.data?.tasks?.[props.taskIndex]?.actions?.[props.actionIndex]
                                    ?.environment?.[envIndex]?.var &&
                                `${errors?.spec?.data?.tasks?.[props.taskIndex]?.actions?.[props.actionIndex]?.environment?.[envIndex]?.var?.message}`
                            }
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            type="text"
                            label="var"
                            required={true}
                            fullWidth
                        />
                        <TextField
                            {...register(
                                `spec.data.tasks.${props.taskIndex}.actions.${props.actionIndex}.environment.${envIndex}.val` as const,
                            )}
                            error={
                                !!errors?.spec?.data?.tasks?.[props.taskIndex]?.actions?.[props.actionIndex]
                                    ?.environment?.[envIndex]?.val
                            }
                            helperText={
                                errors?.spec?.data?.tasks?.[props.taskIndex]?.actions?.[props.actionIndex]
                                    ?.environment?.[envIndex]?.val &&
                                `${errors?.spec?.data?.tasks?.[props.taskIndex]?.actions?.[props.actionIndex]?.environment?.[envIndex]?.val?.message}`
                            }
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            type="text"
                            label="val"
                            fullWidth
                        />
                        <DeleteButton hideText onClick={() => actionRemoveEnvVars(envIndex)} />
                    </Stack>
                ))}
                <Button onClick={() => actionAppendEnvVars({ var: "", val: "" })}>Add Variable</Button>
            </Box>
            {/*Envvars*/}
            <TextField
                {...register(`spec.data.tasks.${props.taskIndex}.actions.${props.actionIndex}.timeout` as const)}
                error={!!errors?.spec?.data?.tasks?.[props.taskIndex]?.actions?.[props.actionIndex]?.timeout}
                helperText={
                    errors?.spec?.data?.tasks?.[props.taskIndex]?.actions?.[props.actionIndex]?.timeout &&
                    `${errors?.spec?.data?.tasks?.[props.taskIndex]?.actions?.[props.actionIndex]?.timeout?.message}`
                }
                margin="normal"
                InputLabelProps={{ shrink: true }}
                type="number"
                label="Timeout"
                datatype="number"
                fullWidth
            />
            <TextField
                {...register(`spec.data.tasks.${props.taskIndex}.actions.${props.actionIndex}.command` as const)}
                error={!!errors?.spec?.data?.tasks?.[props.taskIndex]?.actions?.[props.actionIndex]?.command}
                helperText={
                    errors?.spec?.data?.tasks?.[props.taskIndex]?.actions?.[props.actionIndex]?.command &&
                    `${errors?.spec?.data?.tasks?.[props.taskIndex]?.actions?.[props.actionIndex]?.command?.message}`
                }
                margin="normal"
                InputLabelProps={{ shrink: true }}
                type="text"
                label="Command"
                fullWidth
            />
            <DeleteButton onClick={() => props.removeAction(props.actionIndex)}>Remove</DeleteButton>
        </Box>
    );
};
