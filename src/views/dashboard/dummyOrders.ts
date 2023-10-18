import {faker} from "@faker-js/faker"
import { OrderStatus, OrdersResponse } from "../../common/order";

function generateSeedData(numOrders: number): OrdersResponse {
	const seedData: OrdersResponse = [];

	for (let i = 1; i <= numOrders; i++) {
		const order: OrdersResponse[0] = {
			id: i,
			status: faker.helpers.arrayElement(Object.values(OrderStatus)),
			organizationId: faker.number.int(),
			customerId: faker.number.int(),
			createdAt: faker.date.past(),
			updatedAt: faker.date.recent(),
            orderItems: [{
                orderItem: {
                    id: faker.number.int(),
                    orderId: i,
                    productId: faker.number.int(),
                    quantityOrdered: faker.number.int(),
                    quanityAvailable: faker.number.int(),
                    dueOn: faker.date.future(),
                    createdAt: faker.date.past(),
                    updatedAt: faker.date.recent(),
                },
                product: {
                    id: faker.number.int(),
                    name: faker.commerce.productName(),
                    description: faker.commerce.productDescription(),
                    createdAt: faker.date.past(),
                    updatedAt: faker.date.recent(),
                }
            }],
			customer: {
				id: faker.number.int(),
				name: faker.company.name(),
				address: {
					street: faker.location.streetAddress(),
                    street2: faker.location.secondaryAddress(),
                    city: faker.location.city(),
                    state: faker.location.state(),
                    zip: faker.location.zipCode(),
				},
				createdAt: faker.date.past(),
				updatedAt: faker.date.recent(),
			},
		};

		seedData.push(order);
	}

	return seedData;
}

// Example usage:
const NUM_ORDERS_TO_GENERATE = 10;
const seedData = generateSeedData(NUM_ORDERS_TO_GENERATE);

export default seedData