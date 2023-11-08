import { Transaction } from "sequelize";
import { ApiRequest, BadRequestError, NewOrderRequestBody, OrderItemStatus, OrderResponse, UserPermission } from "../../../../common";
import { authenticateUser } from "../authenticateUser";
import { sequelize } from "../../db";
import { Order } from "../../models";
import { logger } from "../../../logger";
import { validateField } from "../../../utils";

export const newOrder = async (request: ApiRequest): Promise<OrderResponse> => {
	let transaction: Transaction | null = null;
	try {
		const { body } = request;
		authenticateUser(request, UserPermission.User, body.organizationId);
		const fields = getFields(request);
		transaction = await sequelize.transaction();
		const order = await createOrder(fields, transaction);
        const ids = await order.addIdentifiers(fields.identifiers, {transaction});
        const items = await order.addItems(fields.items, {transaction});

        await transaction.commit();
        transaction = null;
        const result: OrderResponse = {
            data: order.sanitize(),
            secondaryIds: ids.map(id => id.sanitize()),
            items: items.map(item => item.sanitize()),
        };
		console.log("Success", {result})
        return result
	} catch (error) {
        logger.error(error);
		if (transaction) await transaction.rollback();
		throw error;
	}
};

const createOrder = async(fields: NewOrderRequestBody, transaction: Transaction) => {
	const order = await Order.create({
		organizationId: fields.organizationId,
		orderedOn: fields.orderedOn,
		dueBy: fields.dueBy,
		customer: fields.customer,
	}, {transaction});
	return order;
};

const getFields = (request: ApiRequest): NewOrderRequestBody => {
	const { body } = request;
	const { organizationId, dueBy, orderedOn, items, customer, identifiers } = body;
	return {
		organizationId: validateField(organizationId,"integer", "organizationId"),
		dueBy: validateField(dueBy, "date", "dueBy"),
		orderedOn: validateField(orderedOn, "date", "orderedOn"),
		customer: validateField(customer, "string", "customer"),
		identifiers: validateIdentifiers(identifiers),
		items: validateItems(items),
	};
};

const validateIdentifiers = (identifiers: any): NewOrderRequestBody["identifiers"] => {
	if (!Array.isArray(identifiers)) throw new BadRequestError("Invalid identifiers");
	return identifiers.map((identifier, index) => {
		const { name } = identifier;
		return {
			name: validateField(name, "string", `identifiers[${index}].name`),
			value: validateField(identifier.value, "string", `identifiers[${index}].value`),
			primary: validateField(!!identifier.primary, "boolean", `identifiers[${index}].primary`),
		};
	});
};

const validateItems = (items: any): NewOrderRequestBody["items"] => {
	if (!Array.isArray(items)) throw new BadRequestError("Invalid items");
	return items.map((item, index) => {
		const { productId, quantity, unit } = item;
		return {
			productId: validateField(productId,"integer", `items[${index}].productId`),
			quantity: validateField(quantity,"integer", `items[${index}].quantity`),
			unit: validateField(unit, "string", `items[${index}].unit`),
			status: validateField(item.status, Object.values(OrderItemStatus), `items[${index}].status`) 
		};
	});
};
