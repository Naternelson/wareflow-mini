import { useFieldArray, useFormContext, UseFieldArrayReturn, Controller } from "react-hook-form";
import { FormFields } from "./types";
import { DeepDayJs } from "../../../common/type_helpers";
import { NewOrderRequestBody } from "../../../common";
import { Button,  IconButton,  Stack, TextField, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";

export const OrderItems = () => {
	const itemsArray = useOrderItemsHooks();
	return (
		<Stack>
			<Typography>Products</Typography>
			{itemsArray.fields.map((field, index) => (
				<ItemsGroup key={field.id} {...itemsArray} index={index} />
			))}
			<Button>Add Line Item</Button>
		</Stack>
	);
};

const useOrderItemsHooks = () => {
	const { control } = useFormContext<FormFields>();
	const itemsArray = useFieldArray<FormFields, "items">({ control, name: "items" });
	return itemsArray;
};

type FieldType = UseFieldArrayReturn<DeepDayJs<NewOrderRequestBody>, "items", "id">;
const ItemsGroup = (props: FieldType & { index: number }) => {
	const {
		control,
		formState: { errors },
	} = useFormContext<FormFields>();

	const removeHandler = () => {
		props.remove(props.index);
	};
	const getErrorMessage = (name: "status" | "quantity" ) => {
		return errors.items?.[props.index]?.[name]?.message;
	};
	return (
		<Stack direction={"row"} spacing={2}>
			<Controller
				name={`items.${props.index}.quantity`}
				control={control}
				rules={{
					min: { value: 1, message: "Quantity must be at least 1" },
					required: { value: true, message: "ID Value is required" },
                    pattern: { value: /^[0-9]+$/, message: "Quantity must be a number" }
				}}
				render={({ field }) => (
					<TextField
						{...field}
						label="Quantity Ordererd"
						error={!!getErrorMessage("quantity")}
						helperText={getErrorMessage("quantity")}
					/>
				)}
			/>
			<IconButton onClick={removeHandler}>
				<Close fontSize="small" />
			</IconButton>
		</Stack>
	);
};
