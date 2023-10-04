import { useSelector } from "react-redux";
import { AppState } from "./store";
import { getBinById } from "./bins";

import { createSelector } from "reselect";
import { Order } from "./orders";

// Basic Selectors
const selectCurrentOrderId = (state: AppState) => state.root.currentOrder;
const selectOrders = (state: AppState) => state.orders;
const selectProducts = (state: AppState) => state.products;

// Reselect Selectors
export const selectCurrentOrder = createSelector(
	[selectCurrentOrderId, selectOrders],
	(currentOrderId, orders) => orders[currentOrderId || ""]
);

export const selectCurrentProduct = createSelector([selectCurrentOrder, selectProducts], (currentOrder, products) =>
	currentOrder ? products[currentOrder.productId] : undefined
);

export const selectOrderBins = createSelector(
	(state: AppState) => state.bins,
	(_: AppState, orderId: string | undefined) => orderId,
	(bins, orderId) => {
		const orderBins = Object.values(bins).filter((bin) => bin.orderId === orderId);
		orderBins.sort((a, b) => (a.createdDate > b.createdDate ? -1 : 1));
		return orderBins;
	}
);

export const selectProductItemsByBinId = createSelector(
	(state: AppState) => state.productItems,
	(_: AppState, binId: string | undefined) => binId,
	(productItems, binId) => {
		const items = Object.values(productItems).filter((item) => item.binId === binId);

		items.sort((a, b) => (a.createdDate > b.createdDate ? -1 : 1));
		return items;
	}
);

//Custom hooks
export const useCurrentOrder = () => {
	const currentOrder = useSelector(selectCurrentOrder) as Order | undefined ;
	const currentProduct = useSelector(selectCurrentProduct);
	return {
		order: currentOrder,
		product: currentProduct,
	};
};

export const useOrderBins = (orderId: string | undefined) => {
	return useSelector((state: AppState) => selectOrderBins(state, orderId));
};

export const useBin = (binId: string | undefined) => {
	const bin = useSelector(getBinById(binId));
	const items = useSelector((state: AppState) => selectProductItemsByBinId(state, binId));
	return { bin, items };
};
