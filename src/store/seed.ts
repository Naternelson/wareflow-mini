// import { AppState } from "./store";

export const seedData: any = {
	root: {
		currentOrder: "WO-0001",
		activeInputs: [
			{
				id: "deviceId",
                label: "Device ID",
				value: "",
				regex: "^d{15}$",
				isRequired: true,
				isTouched: false,
				isValid: null,
				autoPrint: true,
				printLabel: null,
				printTo: null,
			},
			{
				id: "udi",
                label: "UDI",
				value: "",
				regex: "^d{9}$",
				isRequired: true,
				isTouched: false,
				isValid: null,
				autoPrint: true,
				printLabel: null,
				printTo: null,
			},
		],
	},
	orders: {
		"WO-0001": {
			orderId: "WO-0001",
			orderDate: "2024-01-01",
			orderTotal: 185,
			orderStatus: "queued",
			productId: "P-0001",
			orderCount: 0,
			createdDate: "2024-01-01",
			updatedDate: "2024-01-01",
		},
	},
	products: {
		"P-0001": {
			id: "P-0001",
			name: "BelleX VZW",
			description: "BelleX VZW",
			customerName: "Freeus",
			itemProperties: {
				udi: {
					id: "udi",
					regex: "^d{9}$",
					defaultValue: "",
					required: true,
					unique: true,
					type: "string",
				},
				deviceId: {
					id: "deviceId",
					regex: "^d{15}$",
					defaultValue: "",
					required: true,
					unique: true,
					type: "string",
				},
			},
		},
	},
	bins: {
		"20240101-0001": {
			id: "20240101-0001",
			orderId: "WO-0001",
			createdDate: "2024-01-01",
			updatedDate: "2024-01-01",
			maxQuantity: 24,
			productId: ["P-0001"],
			quantityByProduct: {
				"P-0001": 0,
			},
			total: 0,
			devices: [],
		},
	},
	productItems: {},
};
