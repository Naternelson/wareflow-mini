import React from "react";
import logo from "./logo.svg";
import { Provider } from "react-redux";
import store from "./store";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import router from "./routing";
import theme from "./theme";
function App() {
	return (
		<Provider store={store}>
			<CssBaseline />
			<ThemeProvider theme={theme}>
				<RouterProvider router={router} />
			</ThemeProvider>
		</Provider>
	);
}

export default App;
