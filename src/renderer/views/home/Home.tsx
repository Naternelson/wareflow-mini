import React from "react";
import { Stack, Typography, TypographyProps } from "@mui/material";
import { SearchBar, StyledColumn } from "../../components";
import {OrderListResponse} from "../../../common";
// import {
// 	OrderStatus,
// 	OrdersResponse,
// 	SanitizedCustomer,
// 	SanitizedOrder,
// 	SanitizedOrderItem,
// 	SanitizedProduct,
// } from "../../../common/order";
import { OrdersList } from "./OrderList";
import { faker } from "@faker-js/faker";

export const Home = () => {
	const { orgNameProps } = useDashboardHooks();
	return (
		<Stack padding={"1rem"} flex={"1"}>
			<Typography {...orgNameProps} />
			<SearchBar float={"right"} />
			{/* <OrdersList orders={fakeOrders} /> */}
		</Stack>
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
