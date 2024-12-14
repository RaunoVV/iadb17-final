import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";
import { FormProvider } from "react-hook-form";
import { TemplateForm } from "../../components/Template/Form";

export const CreateTemplate = () => {
	const defaultTaskValue = { name: "", environment: [{ var: "", val: "" }] };
	const methods = useForm({
		refineCoreProps: { redirect: "edit" },
		defaultValues: {
			tasks: [defaultTaskValue],
		},
	});
	const {
		saveButtonProps,
		refineCore: { formLoading },
	} = methods;

	return (
		<Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
			<FormProvider {...methods}>
				<TemplateForm action="create" />
			</FormProvider>
		</Create>
	);
};
