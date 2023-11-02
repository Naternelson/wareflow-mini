import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Home, ProtectedLayout } from "../views";
import { PublicLayout } from "../views/public_layout";
import { LoginPage } from "../views/login";
import { OrdersNewPage } from "../views/orders_new";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <PublicLayout />,
		children: [
			{
				index: true,
				element: <LoginPage />,
			},
		],
	},
	{
		path: "/:organizationId",
		element: <ProtectedLayout />,
		children: [
			{
				index: true,
				element: <Home />,
			},
			{
				element: <OrdersNewPage />,
				path: "orders/new"
			},
			{
				element: <Home />,
				path: "orders"
			}
		],
	},
]);
