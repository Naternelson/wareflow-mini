import { Typography, TypographyProps } from "@mui/material";
import { SearchBar,  StyledColumn } from "../../components";
import { OrderStatus, OrdersResponse, SanitizedCustomer, SanitizedOrder, SanitizedOrderItem, SanitizedProduct } from "../../common/order";
import { OrdersList } from "./OrderList";
import {faker} from "@faker-js/faker"


export const Home = () => {
	const { orgNameProps } = useDashboardHooks();
	return (
		<StyledColumn padding={"1rem"} flex={"1"}>
			<Typography {...orgNameProps} />
			<SearchBar float={"right"} />
			<OrdersList orders={fakeOrders} />
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
const makeId = () => faker.number.int({ min: 1, max: 1000 });


const createFakeOrders = (count: number): OrdersResponse => {
	const orders: OrdersResponse = [];
	for(let i = 0; i < count; i++) {
		const customer = createFakeCustomer();
		const order = createFakeOrder(customer);
		const products = Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, () => createFakeProduct(order));
		const items = products.map((product) => ({ ...createFakeOrderItem(order, product), product }));
		orders.push({
			...order,
			items,
			customer,
		});
	}
	return orders
}

const createFakeCustomer = (): SanitizedCustomer => {
	return {
		id: makeId(), 
		name: faker.company.name(),
		address: {
			street: faker.location.streetAddress(),
			city: faker.location.city(),
			state: faker.location.state(),
			zip: faker.location.zipCode(),
		},
		createdAt: faker.date.recent(),
		updatedAt: new Date(),
	}
}

const createFakeOrder = (customer: SanitizedCustomer): SanitizedOrder => {
	return {
		id: makeId(),
		organizationId: makeId(),
		customerId: customer.id,
		dueOn: faker.date.future(),
		receivedDate: faker.date.recent(),
		deliverToId: makeId(),
		createdAt: faker.date.recent(),
		updatedAt: new Date(),
	}
}

const createFakeProduct = (order: SanitizedOrder): SanitizedProduct => {
	return {
		id: makeId(),
		name: faker.commerce.productName(),
		organizationId: order.organizationId,
		description: faker.commerce.productDescription(),
		createdAt: faker.date.recent(),
		updatedAt: new Date(),
	}
}

const createFakeOrderItem = (order: SanitizedOrder, product: SanitizedProduct): SanitizedOrderItem => {
	const orderSize = faker.number.int({min: 1, max: 1000})
	return {
		id: makeId(),
		orderId: order.id,
		productId: product.id,
		quantityOrdered: orderSize,
		quanityAvailable: faker.number.int({min: 0, max: orderSize}),
		status: faker.helpers.arrayElement(Object.values(OrderStatus)),
		createdAt: faker.date.recent(),
		updatedAt: new Date(),
	}
}
const fakeOrders = createFakeOrders(20)

