import React from "react";
import { InputBase, styled, InputAdornment, Box, InputBaseProps, BoxProps } from "@mui/material";
import { Search } from "@mui/icons-material";

type SearchBarContainerProps = BoxProps & { float?: "left" | "right" };
const SearchBarContainer = styled(({ float, ...otherProps }: SearchBarContainerProps) => <Box {...otherProps} />)(
	({ float }) => ({
		display: "flex",
		alignItems: "center",
		borderRadius: "2rem",
		flexDirection: float === "right" ? "row-reverse" : "row",
		gap: "1rem",
	})
);

const StyledSearchBar = styled(InputBase)(({ theme }) => ({
	width: "50%", // Default width
	minWidth: "10rem", // Minimum width to prevent it from being too narrow
	borderRadius: "2rem",
	backgroundColor: theme.palette.background.paper,
	padding: "0.1rem 1rem",
	boxShadow: theme.shadows[2], // Elevation when focused
	transitionProperty: "width, box-shadow",
	transitionDuration: "0.6s",
	transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
	"&.Mui-focused": {
		width: "100%", // Expands to 100% when focused
		boxShadow: theme.shadows[5], // Elevation when focused
		transitionProperty: "width, box-shadow",
		transitionDuration: "0.6s",
		transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
	},
}));

// Define the SearchBar component props
export type SearchBarProps = BoxProps & {
	InputProps?: InputBaseProps;
	float?: "left" | "right";
};

// SearchBar component
export const SearchBar = (props: SearchBarProps) => {
	const { InputProps, ...otherProps } = props;
	return (
		<SearchBarContainer {...otherProps}>
			<StyledSearchBar
				placeholder="Search..."
				endAdornment={
					<InputAdornment position="end">
						<Search fontSize="small" />
					</InputAdornment>
				}
				{...InputProps}
			/>
		</SearchBarContainer>
	);
};
