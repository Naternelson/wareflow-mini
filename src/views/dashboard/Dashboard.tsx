import { Box, Typography, TypographyProps, List, ListItem } from "@mui/material";
import { StyledColumn, StyledFlex, StyledRow } from "../../components";
import {useState, useEffect} from "react"
import { OrdersResponse } from "../../common/order";
import dummyOrders from "./dummyOrders";

export const Dashboard = () => {
	const { orgNameProps } = useDashboardHooks();
	return (
		<StyledColumn padding={"1rem"} flex={"1"}>
			<Typography {...orgNameProps} />
			<OrderList />
		</StyledColumn>
	);
};

const useDashboardHooks = (): {
	orgNameProps: TypographyProps;
} => {
	return {
		orgNameProps: {
			variant: "h3",
			children: "Ogden Custom Solutions",
		},
	};
};

const OrderList = () => {
	const orders = useOrderListHooks();
	return (
		<List>
			{orders.map((order) => (
				<ListItem key={order.id} >
					<StyledColumn gap={".5rem"}>
						<Typography>{order.id}</Typography>
						<Typography>{order.customer.name}</Typography>
					</StyledColumn>
					<Typography>{order.status}</Typography>
				</ListItem>
			))}
		</List>
	);
};

const useOrderListHooks = () => {
    const [orders, setOrders] = useState<OrdersResponse>(dummyOrders);
	useEffect(()=>{
		console.log(orders)
	},[])

	return orders
    
}