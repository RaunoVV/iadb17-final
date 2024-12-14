import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";
import { FormProvider } from "react-hook-form";
import { TemplateForm } from "../../components/Template/Form";
import { templateSchema, type TTemplate } from "shared/types/Template";
import type { HttpError } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";

export const EditTemplate = () => {
    // const defaultTaskValue = { name: "", environment: [{ var: "", val: "" }] };

    const methods = useForm<TTemplate, HttpError, TTemplate>({
        refineCoreProps: { redirect: "edit" },
        resolver: zodResolver(templateSchema),
        defaultValues: {
            // spec: { data: { tasks: [defaultTaskValue] } },
            spec: {
                data: {
                    tasks: [
                        {
                            name: "",
                            worker: "",
                            volumes: [""],
                            environment: [{ var: "", val: "" }],
                            actions: [
                                {
                                    name: "",
                                    image: "",
                                    environment: [{ var: "", val: "" }],
                                },
                            ],
                        },
                    ],
                },
            },
        },
    });
    const {
        saveButtonProps,
        refineCore: { formLoading },
    } = methods;

    return (
        <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
            <FormProvider {...methods}>
                <TemplateForm action="edit" />
            </FormProvider>
        </Edit>
    );
};
