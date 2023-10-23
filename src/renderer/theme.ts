import { createTheme } from "@mui/material";

const theme = createTheme({
	typography: {
		htmlFontSize: 14,
		fontSize: 12,
		fontFamily: [
			"Inter",
			"-apple-system",
			"BlinkMacSystemFont",
			'"Segoe UI"',
			"Roboto",
			'"Helvetica Neue"',
			"Arial",
			"sans-serif",
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(","),
	},
	palette: {
		primary: {
			main: "#3C4355",
		},
		secondary: {
			main: "#3C4355",
		},
		background: {
			default: "#EFEFEF",
		},
	},
	components: {
		MuiTextField: {
			defaultProps: {
				variant: "outlined",
				fullWidth: true,
				size: "small",
			},
		},
	},
});

export default theme;
