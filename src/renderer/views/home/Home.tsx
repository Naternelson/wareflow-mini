import React, { useEffect } from "react";
import { Button, Divider, Paper, Stack, Typography, TypographyProps, styled } from "@mui/material";
import { SearchBar } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/slices";
import { AppDispatch } from "../../store";
import { getOrders } from "../../store/slices/orders";
import { useNavigate } from "react-router-dom";

export const Home = () => {
	const { orgNameProps, nav } = useDashboardHooks();
	return (
		<StyledPaperContainer elevation={3} >
			<Stack direction={"column"} spacing="1rem" padding={"1rem"}>
				<Typography {...orgNameProps} />
				<Divider />
				<Stack direction={"row"} justifyContent={"space-between"} width={"100%"}>
					<Button color="primary" onClick={() => nav("./orders/new")}>New Order</Button>
					<SearchBar float={"right"} />
				</Stack>
			</Stack>
		</StyledPaperContainer>
	);
};

const useDashboardHooks = (): {
	orgNameProps: TypographyProps;
	nav: ReturnType<typeof useNavigate>;
} => {
	const orgName = useSelector<RootState, string | undefined>((state) => state.auth.organization?.name);
	const dispatch = useDispatch<AppDispatch>();
	useEffect(() => {
		const fn = async () => {
			dispatch(getOrders({ body: {} }));
		};
		fn();
	}, [dispatch]);
	const nav = useNavigate();
	return {
		orgNameProps: {
			variant: "h3",
			children: orgName,
			fontWeight: "bold",
			fontStyle: "italic",
			color: "grey",
			// textAlign: "center",
		},
		nav
	};
};

const StyledPaperContainer = styled(Paper)(({ theme }) => ({
	margin: "1rem auto",
	width: "100%", 
	maxWidth: "800px",
}));