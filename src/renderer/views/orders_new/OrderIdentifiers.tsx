import { useFieldArray, useFormContext, UseFieldArrayReturn, Controller } from "react-hook-form";
import { FormFields } from "./types";
import { DeepDayJs } from "../../../common/type_helpers";
import { NewOrderRequestBody } from "../../../common";
import {
	Button,
	FormControlLabel,
	IconButton,
	Radio,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useEffect } from "react";

export const OrderIdentifiers = () => {
	const idsArray = useOrderIdHooks();
	return (
		<Stack>
			<Typography>Custom IDs</Typography>
			<Stack spacing={1}>
				{idsArray.fields.map((field, index) => (
					<IdentifierGroup key={field.id} {...idsArray} index={index} />
				))}
			</Stack>
			<Button onClick={() => idsArray.append({ name: "", value: "", primary: false })}>Add ID</Button>
		</Stack>
	);
};

const useOrderIdHooks = () => {
	const { control } = useFormContext<FormFields>();
	const idsArray = useFieldArray<FormFields, "identifiers">({ control, name: "identifiers" });
    const fields = idsArray.fields;
    const update = idsArray.update;
    useEffect(() => {
        const primaryExists = fields.some((field) => field.primary);    
        if (!primaryExists && fields.length > 0) {
            update(0, {...fields[0], primary: true});
        }
    },[fields, update])

	return idsArray;
};

type FieldType = UseFieldArrayReturn<DeepDayJs<NewOrderRequestBody>, "identifiers", "id">;
const IdentifierGroup = (props: FieldType & { index: number }) => {
	const { control, getValues, formState: {errors} } = useFormContext<FormFields>();

	const removeHandler = () => {
		props.remove(props.index);
	};
    const getErrorMessage = (name: "value" | "name" | "primary") => {
        return errors.identifiers?.[props.index]?.[name]?.message;
    }
	return (
		<Stack direction={"row"} spacing={2} alignItems={"start"}>
			<Controller
				name={`identifiers.${props.index}.primary`}
				control={control}
				render={({ field: { onChange, ...field } }) => {
					const checked = typeof field.value === "string" ? field.value === "true" : field.value;
					return <FormControlLabel
						onChange={() => {
							onChange(true);
							props.fields.forEach((_identifier, idx) => {
								const identifier = getValues(`identifiers.${idx}`);
								if (idx === props.index) props.update(idx, { ...identifier, primary: true });
								else props.update(idx, { ...identifier, primary: false });
								console.log(identifier, idx);
							});
						}}
						control={
							<Radio
								{...field}
								checked={checked}
								color={!!getErrorMessage("primary") ? "error" : "default"}
							/>
						}
						label={
							<Typography
								fontWeight={checked ? "bold" : "normal"}
								fontStyle={"italic"}>
								Primary
							</Typography>
						}
					/>
				}}
			/>
			<Controller
				name={`identifiers.${props.index}.name`}
				control={control}
				rules={{
					required: { value: true, message: "ID Name is required" },
					validate: {
						unique: (value, formValues) => {
							const names = formValues.identifiers.map((field) => field.name);
							const filtered = names.filter((name) => name === value);
							return filtered.length === 1 || "ID Name must be unique";
						},
					},
				}}
				render={({ field }) => (
					<TextField
						{...field}
						label="ID Name"
						placeholder={"WO, PO, etc"}
						error={!!getErrorMessage("name")}
						helperText={getErrorMessage("name")}
						fullWidth={false}
					/>
				)}
			/>
			<Controller
				name={`identifiers.${props.index}.value`}
				control={control}
				rules={{
					required: { value: true, message: "ID Value is required" },
				}}
				render={({ field }) => (
					<TextField
						{...field}
						label="ID Value"
						placeholder={"1234567890"}
						error={!!getErrorMessage("value")}
						helperText={getErrorMessage("value")}
					/>
				)}
			/>
			<IconButton onClick={removeHandler}>
				<Close fontSize="small" />
			</IconButton>
		</Stack>
	);
};
