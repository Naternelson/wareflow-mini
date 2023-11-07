import React, { PropsWithChildren, ReactNode, useState } from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	TypographyProps,
	ButtonBase,
	ButtonBaseProps,
	Menu,
	MenuItem,
	IconButton,
	styled,
	Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { StyledColumn, StyledRow } from "../../components";
import { ArrowDropDown, Home } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../store/slices";

export const NavBar = () => {
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
						<NavMenu label={"Home"} to="/">
							<HomeMenu/>
						</NavMenu>

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
	const name = useSelector<RootState, string | undefined>((state) => state.auth.organization?.name);
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
			children: name,
		},
	};
};

const HomeMenu = (props: {handleClose?: () => void}) => {
	const nav = useNavigate();
	const handleNav = () => {
		nav("orders/new");
		if(props.handleClose){
			props.handleClose();
		}
	};
	return (
		<>
			<MenuItem onClick={handleNav}>New Order</MenuItem>
		</>
	);
};

const NavMenu = (props: PropsWithChildren<{ label: string; Icon?: ReactNode; to?: string }>) => {
	const { label, Icon, to, children } = props;
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const ref = React.useRef<HTMLButtonElement>(null);
	const handleClick = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		setAnchorEl(ref.current);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const nav = useNavigate();
	const handleNav = () => {
		if (to) {
			nav(to);
		}
		handleClose();
	};

	return (
		<>
			<ButtonBase ref={ref} style={{ alignItems: "center", gap: ".25rem" }} onClick={handleNav}>
				{Icon && Icon}
				<Typography variant="body1">{label}</Typography>
				<StyledIconContainer onClick={handleClick} color={"inherit"}>
					<StyledArrowDropDown aria-expanded={Boolean(anchorEl)} fontSize="small" color={"inherit"} />
				</StyledIconContainer>
			</ButtonBase>
			<Menu onClose={handleClose} open={Boolean(anchorEl)} anchorEl={anchorEl}>
				{React.Children.map(children, (child) => {
					return React.cloneElement(child as React.ReactElement, { handleClose });
				})}
			</Menu>
		</>
	);
};


const StyledArrowDropDown = styled(ArrowDropDown)(({ theme, ...props }) => ({
	transform: props["aria-expanded"] ? "rotate(180deg)" : "rotate(0deg)",
	transition: "transform .2s ease-in-out",
}))

const StyledIconContainer = styled(Box)(({ theme }) => ({
	width: "1.5rem",
	height: "1.5rem",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}));