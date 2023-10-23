import { Stack } from "@mui/material";
import { OrdersResponse } from "../../../common/order";
import { OrderLineItem } from "./OrderLine";
import { useFocusLock } from "../../utility";

export const OrdersList = (props: { orders: OrdersResponse }) => {
	// avoid selectros should inlcude buttons and any element that has a aria-hidden attribute
	const avoidSelectors = ["button", "[aria-hidden='true']"];
	const ref = useFocusLock({ loop: false, includeUpDownKeys: true, avoidSelectors, focusOnMount: true });
	return (
		<Stack ref={ref} width={"100%"} gap={"2px"}>
			{props.orders.map((order) => (
				<OrderLineItem order={order} key={order.id} />
			))}
		</Stack>
	);
};
