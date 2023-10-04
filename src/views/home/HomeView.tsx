import { Box, Typography, styled, Paper } from "@mui/material";
import { ProductItemForm } from "./ProductItemForm";

export const HomeView = () => {
	return (
		<PageContainer>
			<ProductItemForm />
		</PageContainer>
	);
};

const PageContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	height: "100vh",
	width: "100vw",
	backgroundColor: theme.palette.background.default,
}));

const CenteredRow = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	justifyContent: "center",
}));

const BoxRow = styled(Box)(() => ({
	display: "flex",
	flexDirection: "row",
}));

const FormContainer = styled(Paper)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	backgroundColor: theme.palette.background.paper,
	padding: theme.spacing(2),
}));

const BoxColumn = styled(Box)(() => ({
	display: "flex",
	flexDirection: "column",
}));

const FormContents = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(2),
}));
