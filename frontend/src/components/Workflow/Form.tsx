import {Autocomplete, Box, createFilterOptions, TextField} from "@mui/material";

import { Controller, useFormContext } from "react-hook-form";
import React from "react";

import { useAutocomplete } from "@refinedev/mui";
import type { THardware } from "shared/types/Hardware";
import type { TTemplate } from "shared/types/Template";

export const WorkflowForm = (props: { action: string }) => {
    const {
        register,
        control,
        formState: {errors},
    } = useFormContext();
    const {autocompleteProps: hardwareAutoCompleteProps} = useAutocomplete<THardware>({
        resource: "hardware",
    });
    const hardwareFilterOptions = createFilterOptions({
        matchFrom: "any",
        stringify: (option: THardware) => option.name,
    });
    const {autocompleteProps: templateAutoCompleteProps} = useAutocomplete<TTemplate>({
        resource: "template",
    });
    const templateFilterOptions = createFilterOptions({
        matchFrom: "any",
        stringify: (option: TTemplate) => option.name,
    });
    console.log("errors", errors);
    const isEditMode = props.action === "edit";
    return (
        <Box component="form" sx={{display: "flex", flexDirection: "column", gap: "12px"}}>
            <TextField
                {...register("name")}
                error={!!errors?.name}
                helperText={errors.name && `${errors.name.message}`}
                margin="normal"
                fullWidth
                InputLabelProps={{shrink: true}}
                type="text"
                label="Name"
                name="name"
                required={true}
                disabled={isEditMode}
            />
            {errors && <span className="text-xs text-red-500">Errors</span>}

            <Controller
                control={control}
                rules={{required: "This field is required"}}
                name="spec.hardwareRef"
                defaultValue={null as never}
                render={({field, fieldState}) => (
                    <Autocomplete
                        {...hardwareAutoCompleteProps}
                        {...field}
                        onChange={(_, value: THardware | null) => field.onChange(value?.name || null)}
                        onInputChange={() => {
                        }}
                        filterOptions={hardwareFilterOptions}
                        value={hardwareAutoCompleteProps.options.find((option) => option.name === field.value) ?? null}
                        getOptionLabel={(item) => {
                            // console.log("fieldValue", field.value);
                            return item.name || "";
                        }}
                        isOptionEqualToValue={(option, value) => {
                            return value === undefined || option.name === value.name;
                        }}
                        renderInput={(params) => {
                            return (
                                <TextField
                                    {...params}
                                    label="Hardware"
                                    variant="outlined"
                                    margin="normal"
                                    required={true}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            );
                        }}
                    />
                )}
            />

            <Controller
                control={control}
                name="spec.templateRef"
                rules={{required: "This field is required"}}
                defaultValue={null as never}
                render={({field, fieldState}) => (
                    <Autocomplete
                        {...templateAutoCompleteProps}
                        {...field}
                        onChange={(_, value: TTemplate | null) => field.onChange(value?.name || null)}
                        onInputChange={() => {
                        }}
                        filterOptions={templateFilterOptions}
                        value={templateAutoCompleteProps.options.find((option) => option.name === field.value) ?? null}
                        getOptionLabel={(item) => {
                            return item.name;
                        }}
                        isOptionEqualToValue={(option, value) => {
                            return value === undefined || option.name === value.name;
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Template"
                                variant="outlined"
                                margin="normal"
                                required={true}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                )}
            />
        </Box>
    );
};
