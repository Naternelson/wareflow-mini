import React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { OrderResponse, OrderStatus } from "../../../common/order";
import { Box, Button, Collapse, Divider, Paper, Stack, Tooltip, Typography, styled } from "@mui/material";
// import { StatusIndicator } from "../../components";
import { toTitleCase } from "../../utility";
import { ProductLine } from "./ProductLine";

const useOrderLineHooks = (order: {}) => {
	const [expanded, setExpanded] = useState(false);
	const nav = useNavigate();
	const lineItemRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!lineItemRef.current) return;
		const ref = lineItemRef.current;
		const handleFocusIn = () => setExpanded(true);
		const handleFocusOut = (e: FocusEvent) => {
			const target = e.relatedTarget as HTMLElement;
			const containsTarget = ref.contains(target);
			const isPresentation = target?.closest("[role='presentation']") !== null;
			if (!containsTarget && !isPresentation) setExpanded(false);
		};

		ref.addEventListener("focusin", handleFocusIn);
		ref.addEventListener("focusout", handleFocusOut);

		return () => {
			ref.removeEventListener("focusin", handleFocusIn);
			ref.removeEventListener("focusout", handleFocusOut);
		};
	}, []);
	const handleClick = () => {
		lineItemRef.current?.focus();
	};
	const navToOrder = () => {
		// nav(`/orders/${order.id}`);
	};
	const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter") {
			navToOrder();
		}
	};
	return { expanded, handleClick, handleKeyPress, navToOrder, lineItemRef };
};

const ItemContainer = styled(Box)(({ theme }) => ({
	position: "relative",
	"& .order-line-header": {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: "0.25rem 1rem",
		borderBottom: `1px solid ${theme.palette.divider}`,
		backgroundColor: theme.palette.background.paper,
		transition: "background-color .1s ease-out",
		cursor: "default",
	},
	"&[data-focus='true'] .order-line-header": {
		backgroundColor: theme.palette.action.focus,
		boxShadow: theme.shadows[5],
		zIndex: 1000,
	},
}));

export const OrderLineItem = (props:{}) => {
	// const { expanded, handleClick, handleKeyPress, navToOrder, lineItemRef } = useOrderLineHooks(props.order);
	// const statuses = props.order.items.map((item) => item.status) || [];
	// const priorityStatus = getPriorityStatus(statuses);
	// const ignore: OrderStatus[] = [OrderStatus.COMPLETED, OrderStatus.CANCELLED, OrderStatus.DELIVERED];
	// const isIgnorable = ignore.includes(priorityStatus);
	return (null
		// <ItemContainer
		// 	ref={lineItemRef}
		// 	tabIndex={0}
		// 	onKeyDown={handleKeyPress}
		// 	onClick={handleClick}
		// 	data-focus={expanded}>
		// 	<Paper elevation={expanded ? 10 : 3}>
		// 		<Box className={"order-line-header"}>
		// 			<Stack
		// 				alignItems={"center"}
		// 				spacing={"1rem"}
		// 				direction={"row"}
		// 				divider={<Divider orientation="vertical" flexItem />}>
		// 				<IdField id={props.order.id} />
		// 				<StatusIndicator status={priorityStatus} />
		// 				<CustomerName name={props.order.customer.name} />
		// 				<OrderProductDescriptor order={props.order} />
		// 				<OrderDates order={props.order} ignore={isIgnorable} />
		// 			</Stack>

		// 			<Button onClick={navToOrder} variant="contained" color="primary" size="small">
		// 				Open
		// 			</Button>
		// 		</Box>
		// 		<Collapse in={expanded}>
		// 			<Stack divider={<Divider />} marginTop="1rem" aria-hidden={!expanded}>
		// 				{props.order.items.map((item, index) => (
		// 					<ProductLine key={item.id} item={item} product={item.product} visible={expanded} />
		// 				))}
		// 			</Stack>
		// 		</Collapse>
		// 	</Paper>
		// </ItemContainer>
	);
};

const IdField = (props: { id?: number }) => {
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
};

const StyledIdFieldContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "row",
	justifyContent: "flex-start",
	alignItems: "center",
	cursor: "default",
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

const CustomerName = (props: { name?: string }) => {
	return (
		<Tooltip title="Customer Name" placement="top-start" arrow>
			<Typography component={"span"} fontWeight={600} fontSize={".8rem"} color="inherit">
				{toTitleCase(props.name || "")}
			</Typography>
		</Tooltip>
	);
};

const OrderProductDescriptor = (props: {}) => {
	// const size = props.order.items.length;
	return (
		// <Tooltip title={size > 1 ? "Product Count" : "Product Name"} placement="top-start" arrow>
			<Typography component={"span"} fontWeight={400} fontSize={".8rem"} color="inherit">
				{/* {getOrderProductDescriptor(props.order)} */}
			</Typography>
		// </Tooltip>
	);
};

// const OrderDates = (props: {}) => {
// 	const title = `Ordered on ${
// 		props.order.receivedDate?.toLocaleDateString() ?? props.order.createdAt?.toLocaleDateString()
// 	}`;

// 	const isError = !props.ignore && props.order.dueOn && props.order.dueOn < new Date();
// 	return (
// 		<Tooltip title={title} placement="top-start" arrow>
// 			<Typography component={"span"} fontWeight={400} fontSize={".8rem"} color={isError ? "error" : "inherit"}>
// 				Due By {props.order.dueOn?.toLocaleDateString()}
// 			</Typography>
// 		</Tooltip>
// 	);
// };

// const getPriorityStatus = (status: Array<OrderStatus | undefined>): OrderStatus => {
// 	if (status.includes(OrderStatus.ERROR)) return OrderStatus.ERROR;
// 	if (status.includes(OrderStatus.PICKING)) return OrderStatus.PICKING;
// 	if (status.includes(OrderStatus.ASSEMBLY)) return OrderStatus.ASSEMBLY;
// 	if (status.includes(OrderStatus.QUEUED)) return OrderStatus.QUEUED;
// 	if (status.includes(OrderStatus.PAUSED)) return OrderStatus.PAUSED;
// 	if (status.includes(OrderStatus.COMPLETED)) return OrderStatus.COMPLETED;
// 	if (status.includes(OrderStatus.CANCELLED)) return OrderStatus.CANCELLED;
// 	if (status.includes(OrderStatus.DELIVERED)) return OrderStatus.DELIVERED;
// 	// Default
// 	return OrderStatus.QUEUED;
// };

// const getOrderProductDescriptor = (order: OrderResponse): string => {
// 	if (order.items.length > 1) return `${order.items.length} Products`;
// 	if (order.items.length === 1) return order.items[0].product?.name || "Unknown Product";
// 	return "No Products Assigned";
// };
