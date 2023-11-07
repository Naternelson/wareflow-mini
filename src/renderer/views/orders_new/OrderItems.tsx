import {
	useFieldArray,
	useFormContext,
	UseFieldArrayReturn,
	Controller,
	RegisterOptions,
	ControllerProps,
} from "react-hook-form";
import { FormFields } from "./types";
import { DToS} from "../../../common/type_helpers";
import { OrderItemStatus } from "../../../common";
import {
	Button,
	Collapse,
	CollapseProps,
	FormControl,
	FormHelperText,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
	styled,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../store/slices";
import { ProductListResponse } from "../../../common/models/product";
import { useWait, wait } from "../../utility/wait";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


/**
 * ORDER ITEMS - MAIN COMPONENT
 * This component is responsible for rendering the list of products ordered
 */
export const OrderItems = () => {
	const {itemsArray,navToNewProduct} = useOrderItemsHooks();
	
	return (
		<StyledStack>
			<Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
				<Typography variant="h6">Products</Typography>
				<Button variant="text" color="secondary" onClick={navToNewProduct}>
					Create New Product
				</Button>
			</Stack>
			{itemsArray.fields.map((field, index) => (
				<ItemsGroup key={field.id} {...itemsArray} index={index} />
			))}
			<Button
				color="primary"
				onClick={() =>
					itemsArray.append({
						productId: undefined,
						quantity: 1,
						unit: "Unit",
						status: OrderItemStatus.PENDING,
					})
				}>
				Add Line Item
			</Button>
		</StyledStack>
	);
};

const StyledStack = styled(Stack)(({ maxHeight }) => ({
	transition: "max-height .5s ease-in-out",
	overflow: "hidden",
	maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : typeof maxHeight === "string" ? maxHeight : "1000px",
}));

type FieldType = UseFieldArrayReturn<FormFields, "items", "id">;

const useOrderItemsHooks = () => {
	const nav = useNavigate()
	const navToNewProduct = () => {
		nav("../products/new");
	}
	const { control } = useFormContext<FormFields>();
	const itemsArray = useFieldArray<FormFields, "items">({ control, name: "items" });
	return {itemsArray, navToNewProduct};
};


/**
 * ITEMS GROUP
 * For Each Product Item in the Order Render the following:
 */

const ItemsGroup = (props: FieldType & { index: number }) => {
	const [open, setOpen] = useState(true);
	const removeHandler = () => {
		setOpen(false);
		wait(500).then(() => {
			props.remove(props.index);
		});
	};
	const ready = useWait(0);
	const collapseProps: CollapseProps = {
		timeout: "auto",
		in: ready && open,
	};
	return (
		<Collapse {...collapseProps}>
			<Stack direction="row" spacing={2} marginY="1rem">
				<ProductSelect {...props} />
				<QuantityField index={props.index} />
				<IconButton onClick={removeHandler}>
					<Close fontSize="small" />
				</IconButton>
			</Stack>
		</Collapse>
	);
};



/**
 * QUNATITY FIELD
 * The number of items ordered for a given product
 */
const QuantityField = ({ index }: { index: number }) => {
	const { control } = useFormContext<FormFields>();

	return (
		<Controller
			name={`items.${index}.quantity`}
			control={control}
			rules={quantityRegisterOptions}
			render={QuantityRender}
		/>
	);
};

const quantityRegisterOptions: RegisterOptions = {
	min: { value: 1, message: "Quantity must be at least 1" },
	required: { value: true, message: "Quantity is required" },
	pattern: { value: /^[0-9]+$/, message: "Quantity must be a number" },
};
const QuantityRender: ControllerProps<FormFields, `items.${number}.quantity`>["render"] = ({
	field: { value, onChange, ...field },
}) => {
	const {
		formState: { errors },
	} = useFormContext<FormFields>();
	const fieldIndex = field.name.split(".")[1];
	const errorMessage = errors.items?.[Number(fieldIndex)]?.["quantity"]?.message;
	const fieldValue = value === 0 ? "0" : value === undefined || value === -1 ? "" : value.toLocaleString();
	return (
		<TextField
			{...field}
			error={!!errorMessage}
			helperText={errorMessage}
			value={fieldValue}
			onChange={(e) => {
				let value: number | undefined = parseInt(e.target.value.replaceAll(/[^0-9]/g, ""));
				if (isNaN(value)) value = -1;
				onChange(value);
			}}
			onBlur={(e) => {
				const value = e.target.value;
				if (value === "") {
					onChange(0);
				}
			}}
			fullWidth={false}
			label="Quantity Ordererd"
		/>
	);
};




/**
 * PRODUCT SELECT
 * Select a product from the list of products
 */
const ProductSelect = (props: FieldType & { index: number }) => {
	const { control } = useFormContext<FormFields>();
	return (
		<Controller
			name={`items.${props.index}.productId`}
			control={control}
			rules={productIdRegisterOptions}
			render={ProductRender}
		/>
	);
};

const productIdRegisterOptions: RegisterOptions = {
	required: { value: true, message: "Must select a product" },
};
const ProductRender: ControllerProps<FormFields, `items.${number}.productId`>["render"] = ({ field }) => {
	const {formState: {errors}} = useFormContext<FormFields>();
	const fieldIndex = field.name.split(".")[1];
	const errorMessage = errors.items?.[Number(fieldIndex)]?.["productId"]?.message;
	const products = useSelector<RootState, DToS<ProductListResponse["products"]>>((state) => state.products.products);
	const productList = Object.values(products).map((product) => {
		const primary = Object.values(product.secondaryIds || {}).find((id) => id.primary);
		return {
			id: product.data?.id,
			name: product.data?.name,
			primaryValue: primary?.value,
			primaryName: primary?.name,
		};
	});
	const label = "Product Name";
	return (
		<FormControl fullWidth size="small" variant="outlined" error={!!errorMessage}>
			<InputLabel id="product-select-label">{label}</InputLabel>
			<Select {...field} labelId="product-select-label" size="small" label={label}>
				{productList.map((product) => {
					return (
						<MenuItem key={product.id} value={product.id} sx={{ gap: "1rem" }}>
							<Typography>{product.name}</Typography>
							<Typography variant="caption">
								{product.primaryName}: {product.primaryValue}
							</Typography>
						</MenuItem>
					);
				})}
			</Select>
			<FormHelperText error={!!errorMessage}>{errorMessage}</FormHelperText>
		</FormControl>
	);
};

