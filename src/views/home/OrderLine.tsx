import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrderResponse, SanitizedOrderItem, SanitizedProduct } from "../../common/order";
import { Box, Button, Collapse, Typography, styled } from "@mui/material";
import { StyledRow } from "../../components";

const useOrderLineHooks = (order: OrderResponse) => {
	const [expanded, setExpanded] = useState(false);
	const nav = useNavigate();
	const lineItemRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!lineItemRef.current) return;
		const ref = lineItemRef.current;
		const handleFocus = () => setExpanded(true);
		const handleBlur = () => setExpanded(false);

		ref.addEventListener("focus", handleFocus);
		ref.addEventListener("blur", handleBlur);

		return () => {
			ref.removeEventListener("focus", handleFocus);
			ref.removeEventListener("blur", handleBlur);
		};
	}, []);
	const handleClick = () => {
        
		lineItemRef.current?.focus();
	};
	const navToOrder = () => {
		nav(`/orders/${order.id}`);
	};
	const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter") {
			navToOrder();
		}
	};
	return { expanded, handleClick, handleKeyPress, navToOrder, lineItemRef };
};

const ItemContainer = styled(Box)(({ theme }) => ({
	"& .order-line-header": {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: "0.25rem 1rem",
		borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
	},
	"&:focus, &:has(:focus-within) .order-line-header": {
		backgroundColor: theme.palette.action.selected,
	},
}));

export const OrderLineItem = (props: { order: OrderResponse }) => {
	const { expanded, handleClick, handleKeyPress, navToOrder, lineItemRef } = useOrderLineHooks(props.order);

	return (
		<ItemContainer
			ref={lineItemRef}
			tabIndex={0}
			onKeyDown={handleKeyPress}
			onClick={handleClick}>
			<Box className={"order-line-header"}><IdField id={props.order.id}/>{props.order.customer.name}<Button  onClick={navToOrder} variant="contained" color="primary">Open</Button></Box>
			<Collapse in={expanded}>
				{props.order.items.map((item, index) => (
					<ProductLine index={index} {...item} key={item.id} />
				))}
			</Collapse>
		</ItemContainer>
	);
};

type ProductLineProps = SanitizedOrderItem & { product: SanitizedProduct, index: number };
const ProductLine = (props: ProductLineProps) => {
	return <Box >{props.product.name}</Box>;
};


const IdField = (props: {id?: number}) => {
    return (
		<StyledIdFieldContainer>
			<Typography
				className="label"
				component={"span"}
				fontWeight={200}
				fontSize={".6rem"}
				fontStyle={"italic"}
				textTransform={"uppercase"}>
				id
			</Typography>
			<Typography component={"span"} fontWeight={500} fontSize={".8rem"} color="inherit">
				{props.id}
			</Typography>
		</StyledIdFieldContainer>
	);
}

const StyledIdFieldContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "row",
	justifyContent: "flex-start",
	alignItems: "center",
	gap: ".25rem",
    color: theme.palette.grey[700],
	"& .label": {
		color: theme.palette.grey[500],
		opacity: 0,
		transition: "opacity .1s",
	},
	"&:hover .label": {
		opacity: 1,
	},
}));