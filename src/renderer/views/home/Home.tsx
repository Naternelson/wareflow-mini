import React from "react";
import { Stack, Typography, TypographyProps } from "@mui/material";
import { SearchBar } from "../../components";
import { useSelector } from "react-redux";
import { RootState } from "../../store/slices";

export const Home = () => {
	const { orgNameProps } = useDashboardHooks();
	return (
		<Stack direction={"column"} flex={"1"} spacing="1rem" padding={"1rem"} maxWidth={"600px"}>
			<Typography {...orgNameProps} />
			<SearchBar float={"right"} />
		</Stack>
	);
};

const useDashboardHooks = (): {
	orgNameProps: TypographyProps;
} => {
	const orgName = useSelector<RootState, string | undefined>((state) => state.auth.organization?.name);
	return {
		orgNameProps: {
			variant: "h3",
			children: orgName,
			fontWeight: "bold",
			fontStyle: "italic",
			color: "grey",
			textAlign: "center"
		},
	};
};
