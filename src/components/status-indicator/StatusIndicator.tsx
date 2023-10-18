import { Box, BoxProps, styled } from "@mui/material";
import { OrderStatus } from "../../common/order";
import { toTitleCase } from "../../utility";

export type StatusIndicatorProps = {
	status: OrderStatus;
};

export const StatusIndicator = (props: StatusIndicatorProps) => {
	return <StyledStatusContainer {...props} />;
};

type StyledStatusContainerProps = BoxProps & {
	status: OrderStatus;
};

const StyledStatusContainer = styled(({ status, ...otherProps }: StyledStatusContainerProps) => (
	<Box {...otherProps} />
))(({ theme, status }) => {
	let color: string;
	switch (status) {
		case OrderStatus.ASSEMBLY:
		case OrderStatus.PICKING:
			color = theme.palette.success.main;
			break;
		case OrderStatus.QUEUED:
			color = theme.palette.primary.main;
			break;
		case OrderStatus.ERROR:
			color = theme.palette.error.main;
			break;
		case OrderStatus.PAUSED:
			color = theme.palette.warning.main;
			break;
		default:
			color = theme.palette.grey[500];
	}
	return {
		position: "relative",
		display: "inline-flex",
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		width: "fit-content",
		padding: "0.25rem",
		gap: "0.25rem",
		"&::before": {
			content: "''",
			position: "relative",
			width: ".7rem",
			height: ".7rem",
			borderRadius: "100%",
			backgroundColor: color,
		},
		"&::after": {
			content: `'${toTitleCase(status)}'`,
			position: "relative",
			fontSize: "1rem",
			fontWeight: "medium",
			color: color,
		},
	};
});
