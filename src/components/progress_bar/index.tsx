import { Box, Tooltip, TooltipProps, styled } from "@mui/material";
import pluralize from 'pluralize';

type AcceptedColors = "primary" | "secondary" | "error" | "warning" | "info" | "success" | "inherit";

export interface ProgressBarProps {
	total: number;
	current: number;
	label?: boolean;
    /** The singular name of the unit (ie device, case, etc) */
	unitAlias?: string;
    placement?: TooltipProps["placement"];
    color?: AcceptedColors | "inherit";
}


export const ProgressBar = ({ total, current, color, label, unitAlias, placement }: ProgressBarProps) => {
	const percent = (current / total) * 100;
    const unit = pluralize(unitAlias || "unit", current).toLowerCase();
    const titleCase = unit.charAt(0).toUpperCase() + unit.slice(1);
	return (
		<ProgressBarContainer aria-description="A Progress Bar">
			{label && (
				<Tooltip title={`${current} ${titleCase}`} placement={placement} arrow>
					<span>{`${current} / ${total}`}</span>
				</Tooltip>
			)}
			<StyledProgressBar data-progress={percent} data-color={color}/>
		</ProgressBarContainer>
	);
};


const StyledProgressBar = styled(Box)<{"data-progress": number, "data-color"?: ProgressBarProps["color"]}>(({ theme, "data-progress": dataProgress, "data-color": color }) => ({
    position: "relative",
    height: theme.spacing(1),
    width: "100%",
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.grey[300],
    "&::after": {
        content: "''",
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        borderRadius: theme.spacing(1),
        width: dataProgress + "%",
        backgroundColor: color === "inherit" ? "inherit" : theme.palette[color || "primary"].main,
    },
}));

const ProgressBarContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    width: "100%",
    flexDirection: "column",
    textAlign: "right",
}));