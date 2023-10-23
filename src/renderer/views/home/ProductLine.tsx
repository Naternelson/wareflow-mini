import { Box, Divider, Stack, Typography } from "@mui/material";
import { OrderStatus, SanitizedOrderItem, SanitizedProduct } from "../../../common/order";
import { ProgressBar, StatusMenu } from "../../components";
import { useState } from "react";

type ProductLineProps = { item: SanitizedOrderItem; product: SanitizedProduct; visible?: boolean };
export const ProductLine = (props: ProductLineProps) => {
	const { item, product } = props;
	const [value, setValue] = useState(item.status || OrderStatus.QUEUED);
	return (
		<Stack
			direction={"row"}
			justifyContent={"space-between"}
			width={"100%"}
			paddingX={"3rem"}
			paddingY={".5rem"}
			tabIndex={0}
			aria-hidden={!props.visible}
			onClick={(e) => {
				e.currentTarget.focus();
			}}>
			<Stack direction={"row"} spacing="1rem" divider={<Divider orientation="vertical" flexItem />}>
				<ProductName {...product} />

				<StatusMenu value={value} onChange={setValue} />
				<OrderQuantity {...item} />
			</Stack>
			<Stack direction={"row"} spacing="1rem">
				{item.quantityOrdered && (
					<Box minWidth={"10rem"}>
						<ProgressBar
							total={item.quantityOrdered}
							current={item.quanityAvailable || 0}
							unitAlias="item"
							label={true}
							color="success"
						/>
					</Box>
				)}
			</Stack>
		</Stack>
	);
};

const ProductName = (props: SanitizedProduct) => {
	return (
		<Stack>
			<Typography variant={"body1"} lineHeight={"1rem"}>
				{props.name}
			</Typography>
			<Typography variant={"caption"} fontStyle={"italic"} fontWeight={"400"}>
				ID {props.id}
			</Typography>
		</Stack>
	);
};

const OrderQuantity = (props: SanitizedOrderItem) => {
	return (
		<Stack direction={"row"} alignItems={"center"} spacing={".5rem"}>
			<Typography variant="caption" fontWeight={"400"}>
				Qty
			</Typography>
			<Typography variant={"body1"} lineHeight={"1rem"} fontWeight={"600"}>
				{props.quantityOrdered || "Unknown"}
			</Typography>
		</Stack>
	);
};
