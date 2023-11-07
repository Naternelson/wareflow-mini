import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Home, ProtectedLayout } from "../views";
import { PublicLayout } from "../views/public_layout";
import { LoginPage } from "../views/login";
import { OrdersNewPage } from "../views/orders_new";
import { NotFoundPage } from "../views/404";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <PublicLayout />,
		errorElement: <NotFoundPage/>,
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
