import { Typography, TypographyProps, List } from "@mui/material";
import { StatusIndicator, StatusMenu, StyledColumn } from "../../components";
import { OrderStatus } from "../../common/order";
import { useState } from "react";


export const Home = () => {
	const { orgNameProps } = useDashboardHooks();
	const [status, setStatus] = useState<OrderStatus>(OrderStatus.QUEUED);
	return (
		<StyledColumn padding={"1rem"} flex={"1"}>
			<Typography {...orgNameProps} />
			{
				Object.values(OrderStatus).map((status) => {
					return <StatusIndicator status={status} key={status}/>;
				})
			}

			<StatusMenu value={status} onChange={setStatus} />
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
	return (
		<List>
		</List>
	);
};
