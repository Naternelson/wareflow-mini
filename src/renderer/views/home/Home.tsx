import React from "react";
import { Stack, Typography, TypographyProps } from "@mui/material";
import { SearchBar } from "../../components";
// import {
// 	OrderStatus,
// 	OrdersResponse,
// 	SanitizedCustomer,
// 	SanitizedOrder,
// 	SanitizedOrderItem,
// 	SanitizedProduct,
// } from "../../../common/order";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/slices";


export const Home = () => {
	const { orgNameProps } = useDashboardHooks();
	return (
		<Stack padding={"1rem"} flex={"1"}>
			<Typography {...orgNameProps} />
			<SearchBar float={"right"} />
			<Link to="/signup">Signup</Link>
			{/* <OrdersList orders={fakeOrders} /> */}
		</Stack>
	);
};

const useDashboardHooks = (): {
	orgNameProps: TypographyProps;
} => {
	const orgName = useSelector<RootState, string | undefined>((state) => state.auth.organization?.name);
	return {
		orgNameProps: {
			variant: "h3",
			children: orgName,
		},
	};
};
