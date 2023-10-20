import { Stack } from "@mui/material";
import { OrdersResponse } from "../../common/order";
import { OrderLineItem } from "./OrderLine";
import { useFocusLock } from "../../utility";

export const OrdersList = (props: { orders: OrdersResponse }) => {

	const ref = useFocusLock({loop: true, avoidSelectors: ["button"], includeLeftRightKeys: true, includeUpDownKeys: true, focusOnMount: 5, preventScollToView:false});
	return (
		<Stack ref={ref}>
			{props.orders.map((order) => (
				<OrderLineItem order={order} key={order.id} />
			))}
		</Stack>
	);
};

