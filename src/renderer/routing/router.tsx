import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Home, Landing, ProtectedLayout } from "../views";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <ProtectedLayout />,
		children: [
			{
				index: true,
				element: <Home />,
			},
		],
	},
	{
		path: "/landing",
		element: <Landing />,
	},
]);
