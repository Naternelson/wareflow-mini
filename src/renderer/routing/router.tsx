import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Home, ProtectedLayout } from "../views";
import { PublicLayout } from "../views/public_layout";
import { LoginPage } from "../views/login";

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
		path: "/:organizatioSlug",
		element: <ProtectedLayout />,
		children: [
			{
				index: true,
				element: <Home />,
			},
		],
	},
]);
