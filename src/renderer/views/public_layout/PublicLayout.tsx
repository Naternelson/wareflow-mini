import React from "react";
import { Box, Typography, styled } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthState } from "../../store/slices/auth";
import { RootState } from "../../store/slices";

export const PublicLayout = () => {
	useRedirect();
	return (
		<ViewBoxContainer>
			<OutletContainer>
				<Outlet />
			</OutletContainer>
			<Footer>
				<Typography>Wareflow Mini</Typography>
				<Typography>2023</Typography>
			</Footer>
		</ViewBoxContainer>
	);
};

const ViewBoxContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	height: "100vh",
	overflow: "auto",
	backgroundColor: theme.palette.background.default,
	color: theme.palette.text.primary,
}));

const OutletContainer = styled(Box)(({ theme }) => ({
	flex: 1,
}));

const Footer = styled("footer")(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
	padding: "1rem",
	backgroundColor: theme.palette.grey[900],
    color: theme.palette.grey[50],
}));

const useRedirect = () => {
	const auth = useSelector<RootState, AuthState>((state) => state.auth);
	const { token, status, organization } = auth;
	const nav = useNavigate();
	React.useLayoutEffect(() => {
		if (status !== "pending" && token && organization?.id) {
			nav("/" + organization?.id);
		}
	}, [status, token, nav, organization?.id]);

}