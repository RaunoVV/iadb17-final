import { useForm } from "@refinedev/react-hook-form";
import { Create } from "@refinedev/mui";

import { FormProvider, type SubmitHandler } from "react-hook-form";
import type { HttpError } from "@refinedev/core";
import { type TWorkflow, type TWorkflowFormValues, workflowSchema } from "shared/types/Workflow";
import { WorkflowForm } from "../../components/Workflow/Form";
import { zodResolver } from "@hookform/resolvers/zod";

export const CreateWorkflow = () => {
    const methods = useForm<TWorkflow, HttpError, TWorkflowFormValues>({
        refineCoreProps: { redirect: "list" },
        resolver: zodResolver(workflowSchema),
    });

    const {
        saveButtonProps,
        refineCore: { formLoading, onFinish },
        handleSubmit,
    } = methods;

    const handleSubmitForm: SubmitHandler<TWorkflowFormValues> = async (submittedValues) => {
        console.log("handleSubmitForm values", submittedValues);
        submittedValues.spec.hardwareRef =
            typeof submittedValues.spec.hardwareRef !== "string"
                ? submittedValues.spec.hardwareRef.name
                : submittedValues.spec.hardwareRef;
        submittedValues.spec.templateRef =
            typeof submittedValues.spec.templateRef !== "string"
                ? submittedValues.spec.templateRef.name
                : submittedValues.spec.templateRef;
        await onFinish(submittedValues);
    };

    return (
        <Create
            isLoading={formLoading}
            saveButtonProps={{
                ...saveButtonProps,
                onClick: handleSubmit(handleSubmitForm),
            }}
        >
            <FormProvider {...methods}>
                <WorkflowForm action="create" />
            </FormProvider>
        </Create>
    );
};
