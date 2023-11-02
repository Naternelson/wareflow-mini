import { FormControl, FormHelperText, Stack, TextField } from "@mui/material";
import { FormFields } from "./types";
import { Controller, ControllerProps, useFormContext } from "react-hook-form";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";

export const GlobalOrderFields = () => {
	return (
		<>
			<CustomerField />
			<Stack direction={"row"} spacing={2}>
				<OrderedOnField />
				<DueByField />
			</Stack>
		</>
	);
};
const CustomerField = () => {
	const { register, formState: {errors} } = useFormContext<FormFields>();
	const field = register("customer", {
		required: { value: true, message: "Customer name is required" },
		minLength: { value: 3, message: "Customer name must be at least 3 characters long" },
	});
	return <TextField {...field} label="Customer" error={!!errors["customer"]} helperText={errors["customer"]?.message?.toString()} />;
};

const OrderedOnField = () => {
	const {
		control,
		formState: { errors },
	} = useFormContext<FormFields>();
	const props: ControllerProps<FormFields> = {
		control,
		name: "orderedOn",
		render: ({ field }) => (
			<FormControl component={"fieldset"} error={!!errors["orderedOn"]} fullWidth>
				<DatePicker label="Ordered On" {...field} slotProps={{ textField: { variant: "outlined" } }} />
				<FormHelperText>{errors["orderedOn"]?.message?.toString()}</FormHelperText>
			</FormControl>
		),
		defaultValue: dayjs(new Date()),
	};
	return <Controller {...props} />;
};
const DueByField = () => {
	const {
		control,
		formState: { errors },
	} = useFormContext<FormFields>();
	const props: ControllerProps<FormFields> = {
		control,
		name: "dueBy",
		render: ({ field }) => (
			<FormControl component={"fieldset"} error={!!errors["dueBy"]} fullWidth>
				<DatePicker label="Due By" {...field} slotProps={{ textField: { variant: "outlined" } }} />
				<FormHelperText>{errors["dueBy"]?.message?.toString()}</FormHelperText>
			</FormControl>
		),
		defaultValue: dayjs(new Date()),
	};
	return <Controller {...props} />;
};
