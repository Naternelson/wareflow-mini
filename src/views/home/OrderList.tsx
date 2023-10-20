import { Stack } from "@mui/material";
import { OrdersResponse } from "../../common/order";
import { OrderLineItem } from "./OrderLine";
import { useEffect, useRef, useState } from "react";
import { useFocusLock } from "../../utility";

export const OrdersList = (props: { orders: OrdersResponse }) => {
    const [focusIndex, setFocusIndex] = useState(0);

	const ref = useFocusLock({loop: false, directChildren: true, includeLeftRightKeys: true, includeUpDownKeys: true, focusOnMount: 5, preventScollToView:false});
	return (
		<Stack ref={ref}>
			{props.orders.map((order) => (
				<OrderLineItem order={order} key={order.id} />
			))}
		</Stack>
	);
};

