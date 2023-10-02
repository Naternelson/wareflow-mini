import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { HomeView } from "../views";

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomeView/>
    }
	// Add other routes as necessary, such as '/login'.
]);

export default router;
