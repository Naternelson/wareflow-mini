import React, { useEffect } from "react";
import { Box, Toolbar, styled } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { NavBar } from "./NavBar";
import { useSelector } from "react-redux";
import { RootState } from "../../store/slices";
import { AuthState } from "../../store/slices/auth";
export const ProtectedLayout = () => {
	// Implement your own Protected Layout here
	useProtectedLayout()
	return (
		<ViewBoxContainer>
			<NavBar />
			<Toolbar />
			<Outlet />
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

export const useProtectedLayout = () => {
	const { token, status } = useSelector<RootState, AuthState>((state) => state.auth);
	const nav = useNavigate();
	useEffect(() => {
		if (status === "idle" && !token) {
			nav("/");
		}
	}, [status, token, nav]);
};
