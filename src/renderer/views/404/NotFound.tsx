import styled from "@emotion/styled";
import { Box, Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
	const location = useLocation();
	const nav = useNavigate();
	return (
		<StyledContainer>
			<Typography variant="h1">404</Typography>
			<Typography variant="h2">Not Found</Typography>
			<Typography variant="caption">{location.pathname}</Typography>
			<Button color="primary" variant="contained" onClick={() => nav(-1)}>Go Back</Button>
		</StyledContainer>
	);
};

const StyledContainer = styled(Box)(() => ({
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
    gap: "1rem",
	alignItems: "center",
	height: "100vh",
	width: "100vw",
}));
