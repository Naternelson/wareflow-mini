import { Typography, TypographyProps, List } from "@mui/material";
import { SearchBar, StatusIndicator, StatusMenu, StyledColumn } from "../../components";
import { OrderStatus } from "../../common/order";
import { useState } from "react";


export const Home = () => {
	const { orgNameProps } = useDashboardHooks();
	return (
		<StyledColumn padding={"1rem"} flex={"1"}>
			<Typography {...orgNameProps} />
		<SearchBar float={"right"}/>
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
