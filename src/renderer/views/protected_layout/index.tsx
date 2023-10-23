import { AppBar, Box, Toolbar, Typography, TypographyProps, ButtonBase, ButtonBaseProps, styled } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { StyledColumn, StyledRow } from "../../components";
import { ArrowDropDown, Home } from "@mui/icons-material";

export const ProtectedLayout = () => {
	// Implement your own Protected Layout here

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

const NavBar = () => {
	const { siteNameButtonProps, siteNameProps, orgNameButtonProps, orgNameProps } = useNavBarHooks();
	return (
		<AppBar position="fixed">
			<Toolbar>
				<StyledColumn gap={".5rem"}>
					<StyledRow gap={"1rem"}>
						<ButtonBase {...siteNameButtonProps}>
							<Typography {...siteNameProps} />
						</ButtonBase>
						<ButtonBase {...orgNameButtonProps}>
							<Typography {...orgNameProps} />
						</ButtonBase>
					</StyledRow>
					<StyledRow gap={"2rem"}>
						<ButtonBase style={{ alignItems: "center", gap: ".25rem" }}>
							<Home fontSize="small" />
							<Typography variant="body1">Home</Typography>
							<ArrowDropDown fontSize="small" />
						</ButtonBase>
						<ButtonBase>
							<Typography variant="body1">Orders</Typography>
							<ArrowDropDown fontSize="small" />
						</ButtonBase>
						<ButtonBase>
							<Typography variant="body1">Products</Typography>
							<ArrowDropDown fontSize="small" />
						</ButtonBase>
						<ButtonBase>
							<Typography variant="body1">Labels</Typography>
							<ArrowDropDown fontSize="small" />
						</ButtonBase>
					</StyledRow>
				</StyledColumn>
			</Toolbar>
		</AppBar>
	);
};

const useNavBarHooks = (): {
	siteNameButtonProps: ButtonBaseProps;
	siteNameProps: TypographyProps;
	orgNameButtonProps: ButtonBaseProps;
	orgNameProps: TypographyProps;
} => {
	const nav = useNavigate();
	const handleSiteNameClick = () => {
		nav("/");
	};
	return {
		siteNameButtonProps: {
			onClick: handleSiteNameClick,
			disableRipple: true,
		},
		siteNameProps: {
			variant: "body2",
			fontWeight: "oblique",
			component: "h6",
			letterSpacing: "5px",
			children: "Wareflow",
		},
		orgNameButtonProps: {
			onClick: handleSiteNameClick,
			disableRipple: true,
		},
		orgNameProps: {
			variant: "body2",
			component: "h6",
			children: "Ogden Custom Solutions",
		},
	};
};
