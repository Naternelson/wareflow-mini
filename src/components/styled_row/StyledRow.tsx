import { ComponentProps } from "react";
import { StyledFlex } from "../styled_flex/StyledFlex";

export const StyledRow = (props: ComponentProps<typeof StyledFlex>) => {
    return <StyledFlex {...props} flexDirection="row" />
}