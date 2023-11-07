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
			main: "#394F71",
		},
		secondary: {
			main: "#E1AA74",
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
