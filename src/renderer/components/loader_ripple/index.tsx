import { styled } from "@mui/material";
import "./style.css";
export const LoaderRipple = () => {
	return (
		<div className="loader loader-ripple">
			<StyledElement /> <StyledElement />
		</div>
	);
};

const StyledElement = styled("div")(({ theme }) => ({
    borderColor: theme.palette.primary.light + " !important",
}));