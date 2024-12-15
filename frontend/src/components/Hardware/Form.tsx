import { Box, Button, TextField } from "@mui/material";

import type React from "react";

import { useFieldArray, useFormContext } from "react-hook-form";

import { HardwareInterface } from "./Interface.tsx";
import {hardwareInterfaceSchema, type THardwareInterface} from "shared/types/Hardware";

export const HardwareForm = (props: { action: string; defaultInterfaceValue: THardwareInterface }) => {
    const {
        register,
        control,
        formState: {errors},
    } = useFormContext();
    const {fields, append, remove} = useFieldArray({
        name: "spec.interfaces",
        control,
    });

    const anotherInterfaceClickHandler = (event: React.MouseEvent<HTMLElement>) => {
        console.log(event);

        append(hardwareInterfaceSchema.parse(props.defaultInterfaceValue));
    };
    return (
        <Box maxWidth="400px" component="form" sx={{display: "flex", flexDirection: "column", gap: "12px"}}>
            <TextField
                {...register("name")}
                error={!!errors?.name}
                helperText={errors?.name && `${errors?.name.message}`}
                margin="normal"
                fullWidth
                InputLabelProps={{shrink: true}}
                type="text"
                label="Name"
                required={true}
                disabled={true}
            />
            {fields.map((intf, index) => (
                <HardwareInterface
                    id={`interface_${index + 1}`}
                    key={index}
                    index={index}
                    data={intf}
                    remove={remove}
                />
            ))}

            <Button onClick={anotherInterfaceClickHandler}>Add another</Button>
        </Box>
    );
};
