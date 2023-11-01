import { FindOptions, InferAttributes } from "sequelize";
import {
	ApiError,
	ApiRequest,
	InternalServerError,
	OrderItemStatus,
	OrderListResponse,
	OrderRequestBody,
	UserPermission,

} from "../../../../common";
import { Op } from "sequelize";
import { authenticateUser } from "../authenticateUser";
import { logger } from "../../../logger";
import { Order, OrderIdentifier, OrderItem } from "../../models";

/**
 * A Controller for getting orders
 * @param request The ApiRequest object containing the request body
 * The Request Body should be of type OrderRequestBody
 * 
 * @returns An OrderListResponse object containing the orders, ids, and secondaryIds 
 */
export const getOrders = async (request: ApiRequest): Promise<OrderListResponse> => {
	try {
		authenticateUser(request, UserPermission.Guest);

		if (!request.meta?.organization?.id) {
			throw new InternalServerError("Invalid metadata");
		}

		const fields = getFields(request.body);
		const query = constructQuery(fields, request.meta.organization.id);
		const orders = await Order.findAll(query);

		return buildOrderListResponse(orders);
	} catch (error) {
		logger.error(error);
		if (error instanceof ApiError) throw error;
		throw new InternalServerError("Failed to get orders");
	}
};

/**
 * This Function takes in a request body and returns a Partial<OrderRequestBody> object
 * It validates the request body and returns the valid fields
 * @param body The request body
 * 
 * @returns 
 */
const getFields = (body?: OrderRequestBody): Partial<OrderRequestBody> => {
	if (!body) return {};

	const { dueBefore, dueAfter, limit, offset, organizationId, orderId, status, orderBy, order } = body;

	return {
		dueBefore: validateDate(dueBefore),
		dueAfter: validateDate(dueAfter),
		limit: validateInteger(limit),
		offset: validateInteger(offset),
		organizationId: validateInteger(organizationId),
		orderId: validateIntegerArray(orderId),
		status: validateStatus(status),
		orderBy: validateOrderBy(orderBy),
		order: validateOrder(order),
	};
};


/**
 * The Various validation functions for the fields
 */


const validateDate = (date?: any): Date | undefined => {
	return date instanceof Date ? date : undefined;
};

const validateInteger = (num?: any): number | undefined => {
	return Number.isInteger(num) ? num : undefined;
};

const validateIntegerArray = (arr?: any): number[] | undefined => {
	return Array.isArray(arr) && arr.every(Number.isInteger) ? arr : undefined;
};

const validateStatus = (status?: any): OrderItemStatus | undefined => {
	return Object.values(OrderItemStatus).includes(status) ? status : undefined;
};

const validateOrderBy = (orderBy?: string): OrderRequestBody["orderBy"] => {
	const validOrderBy = ["status", "dueBy", "orderedOn", "customer"];
	return validOrderBy.includes(orderBy || "") ? orderBy as OrderRequestBody["orderBy"] : undefined;
};

const validateOrder = (order?: string): OrderRequestBody["order"] => {
	const validOrderDirections = ["ASC", "DESC"];
	return validOrderDirections.includes(order || "") ? order as OrderRequestBody["order"] : undefined;
};

/**
 * This function contructs a query based on the fields and organizationId provided
 * @param fields A Partial<OrderRequestBody> object
 * @param organizationId An organizationId to filter by
 * @returns 
 */
const constructQuery = (fields: Partial<OrderRequestBody>, organizationId: number): FindOptions<InferAttributes<Order>> => {
	const where: any = { organizationId };
	const { dueBefore, dueAfter, limit, offset, orderId, status, orderBy, order } = fields;

	if (dueBefore && dueAfter) {
		where.dueBy = {
			[Op.lte]: new Date(dueBefore),
			[Op.gte]: new Date(dueAfter),
		};
	}

	if (orderId) where.id = { [Op.in]: Array.isArray(orderId) ? orderId : [orderId] };
	if (status) where.status = { [Op.in]: Array.isArray(status) ? status : [status] };

	return {
		where,
		limit,
		offset,
		order: orderBy ? [[orderBy, order || "ASC"]] : undefined,
		include: [
			{ model: OrderItem, as: "items" },
			{ model: OrderIdentifier, as: "orderIdentifiers" },
		],
	};
};

/**
 * This function takes in an array of Order objects and returns an OrderListResponse object
 * containing the orders, ids, and secondaryIds
 * This contructs the final response the renderer
 * @param orders An array of Order objects
 * @returns An OrderListResponse object containing the orders, ids, and secondaryIds
 */
const buildOrderListResponse = (orders: Order[]): OrderListResponse => {
	const result: OrderListResponse = {
		orders: {},
		ids: [],
		secondaryIds: {},
	};

	orders.forEach((order) => {
		result.orders[order.id] = {
			data: order.sanitize(),
			items: order.items.map((item) => item.sanitize()),
			secondaryIds: order.orderIdentifiers.map((id) => id.sanitize()),
		};
		result.ids.push(order.id);
		result.secondaryIds[order.id] = order.orderIdentifiers.map((id) => id.sanitize());
	});

	return result;
};
