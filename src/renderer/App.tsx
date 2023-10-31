import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import { router } from "./routing";
import theme from "./theme";
import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
function App() {
	return (
		<Provider store={store}>
			<PersistGate persistor={persistor}>
				<CssBaseline />
				<ThemeProvider theme={theme}>
					<RouterProvider router={router} />
				</ThemeProvider>
			</PersistGate>
		</Provider>
	);
}

export default App;
