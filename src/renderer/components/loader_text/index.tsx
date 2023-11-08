import { Typography, styled } from "@mui/material";
import { useEffect, useState } from "react";

export const LoaderText = ({ text, interval = 20 }: { text: string; interval?: number }) => {
	const [displayText, setDisplayText] = useState("");

	useEffect(() => {
		let index = 0;
		const intervalId = setInterval(() => {
			if (index <= text.length) {
				setDisplayText(text.substring(0, index));
				index++;
			} else {
				clearInterval(intervalId);
			}
		}, interval);

		return () => clearInterval(intervalId);
	}, [text, interval]);

	return (
		<StyledLoader className="loader">
			<Typography variant="overline" color={"grey"} fontSize={"1.5rem"} letterSpacing={".2rem"} noWrap>
				{displayText}
			</Typography>
		</StyledLoader>
	);
};

const StyledLoader = styled("div")(() => {
	return {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		textAlign: "center",
	};
});
