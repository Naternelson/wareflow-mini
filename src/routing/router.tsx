import { createBrowserRouter } from "react-router-dom";
import { Dashboard, Landing, ProtectedLayout } from "../views";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <ProtectedLayout />,
		children: [
			{
				index: true,
				element: <Dashboard />,
			},
		],
	},
	{
		path: "/landing",
		element: <Landing />,
	},
]);
