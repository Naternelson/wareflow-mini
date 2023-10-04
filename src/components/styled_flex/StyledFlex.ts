import { Box, styled } from "@mui/material";

const customProperties = ["justifyContent", "alignItems", "gap", "flex", "flexDirection"];
export const StyledFlex = styled(Box, { shouldForwardProp: (prop) => !customProperties.includes(String(prop)) })<{
	justifyContent?: string;
	alignItems?: string;
	gap?: string;
	flex?: string;
	flexDirection?: string;
}>`
	display: flex;
	justify-content: ${({ justifyContent }) => justifyContent || "flex-start"};
	align-items: ${({ alignItems }) => alignItems || "center"};
	gap: ${({ gap }) => gap || "0"};
	flex: ${({ flex }) => flex || "0 1 auto"};
	flex-direction: ${({ flexDirection }) => flexDirection || "row"};
`;
