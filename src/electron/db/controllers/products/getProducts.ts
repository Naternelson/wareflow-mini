import { InferAttributes, Op } from "sequelize";
import { ApiRequest, UserPermission } from "../../../../common";
import { ProductListResponse, ProductRequestBody } from "../../../../common/models/product";
import { validateField } from "../../../utils";
import { authenticateUser } from "../authenticateUser";
import { FindOptions } from "sequelize";
import { Product, ProductIdentifier, ProductSpec } from "../../models";
import { BasicProductIdentifier } from "../../../../common/models/product-identifier";
import { logger } from "../../../logger";

export const getProducts = async (request:ApiRequest):Promise<ProductListResponse> => {
    try {
        const {body} = request
        const {organizationId} = body
        authenticateUser(request, UserPermission.User, organizationId);
        const fields = validateFields(request)
        const query = constructQuery(fields)
    console.log("REQUEST GETPRODUCTS", {query: query});

        const products = await Product.findAll(query)
        const result:ProductListResponse = {
            products: {},
            ids: [],
            secondaryIds: {},
        }
        products.forEach(product => {
            const sanitized = product.sanitize()
            const {productIdentifiers} = product || {}

            result.products[sanitized.id] = {
                data: sanitized,
                specs: product?.productSpecs?.map(spec => spec.sanitize()),
                ids: productIdentifiers?.map(identifier => identifier.id),
                secondaryIds: productIdentifiers?.reduce((acc, identifier) => {
                    acc[identifier.id] = identifier.sanitize()
                    return acc
                }, {} as Record<number, BasicProductIdentifier>)
            }
            result.ids.push(sanitized.id)
            result.secondaryIds[sanitized.id] = product.productIdentifiers.map(identifier => identifier.sanitize())
        })
        return result
    } catch (error) {
        logger.error(error)
        throw error
    }
}

const validateFields = (request:ApiRequest):ProductRequestBody => {
    const {body} = request
    const {organizationId, productId, search, limit, offset, orderBy} = body
    const requestBody:ProductRequestBody = {}
    if(organizationId) requestBody.organizationId = validateField(organizationId, "integer", "organizationId")
    if(Array.isArray(productId)) requestBody.productId = productId.map(id => validateField(id, "integer", "productId"))
    else if(productId) requestBody.productId = validateField(productId, "integer", "productId")
    if(search) requestBody.search = validateField(search, "string", "search")
    if(limit) requestBody.limit = validateField(limit, "integer", "limit")
    if(offset) requestBody.offset = validateField(offset, "integer", "offset")
    if(orderBy) {
        Object.entries(orderBy).forEach(([key, value]) => {
            requestBody.orderBy = requestBody.orderBy || {}
            requestBody.orderBy[key] = validateField(value, "string", `orderBy.${key}`)
        })
    }
    return requestBody
}



const constructQuery = (fields: ProductRequestBody): FindOptions<InferAttributes<Product>> => {
	const query: FindOptions<InferAttributes<Product>> = {
		where: {},
		include: [
			{
				model: ProductIdentifier,
				as: "productIdentifiers", // replace with the actual alias you have given for the relation
			},
            {
                model: ProductSpec,
                as: "productSpecs"
            }
		],
		order: [],
	};

	if (fields.organizationId) query.where = { ...query.where, organizationId: fields.organizationId };
	if (fields.productId) query.where = { ...query.where, id: fields.productId };

	if (fields.search) {
		query.where = {
			...query.where,
			[Op.or]: [
				{ name: { [Op.iLike]: `%${fields.search}%` } },
				{
					"$productIdentifiers.value$": {
						[Op.iLike]: `%${fields.search}%`,
					},
				},
			],
		};

	}

	if (fields.orderBy) {
		Object.entries(fields.orderBy).forEach(([key, value]) => {
			(query.order as Array<any>).push([key, value]);
		});
	}

	if (fields.limit) query.limit = fields.limit;
	if (fields.offset) query.offset = fields.offset;

	return query;
};
