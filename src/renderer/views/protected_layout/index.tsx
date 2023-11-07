import React, { useEffect } from "react";
import { Box, Button, Stack, Toolbar, Typography, styled } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { NavBar } from "./NavBar";
import { useSelector } from "react-redux";
import { RootState } from "../../store/slices";
import { AuthState } from "../../store/slices/auth";
export const ProtectedLayout = () => {
	// Implement your own Protected Layout here
	useProtectedLayout();
	const nav = useNavigate();
	const clickBackHandler = () => {
		nav(-1);
	};
	return (
		<ViewBoxContainer>
			<NavBar />
			<Toolbar />
			<OutletContainer id={"yo"}>
				<Outlet />
				<Footer>
					<Stack>
						<Typography variant="overline">© 2023 - 2024 Wareflow</Typography>
						<Box>
							<Button fullWidth={false} size="small" onClick={clickBackHandler}>
								Back
							</Button>
						</Box>
					</Stack>
				</Footer>
			</OutletContainer>
		</ViewBoxContainer>
	);
};

const ViewBoxContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	height: "100vh",
	backgroundColor: theme.palette.background.default,
	color: theme.palette.text.primary,
}));

export const useProtectedLayout = () => {
	const { token, status } = useSelector<RootState, AuthState>((state) => state.auth);
	const nav = useNavigate();
	useEffect(() => {
		if (status === "idle" && !token) {
			nav("/");
		}
	}, [status, token, nav]);
};

const OutletContainer = styled(Box)(({ theme }) => ({
	flexGrow: 1,
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
	overflow: "overlay",
	scrollbarGutter: "stable both-edges"
}));

const Footer = styled("footer")(({ theme }) => ({
	textAlign: "center",
	marginTop: "1rem",
	padding: "1rem",
	backgroundColor: theme.palette.grey[300],
}))