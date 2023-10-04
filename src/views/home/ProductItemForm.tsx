import { Box, ButtonBase, Divider, Paper, TextField, TextFieldProps, styled } from "@mui/material";
import { useCurrentOrder } from "../../store/utilities";
import { ProgressBar, StyledColumn, StyledRow } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { AppState, updateInput } from "../../store";
import { useForm } from "react-hook-form";

export const ProductItemForm = () => {
	const { order, product } = useCurrentOrder();
	return (
		<StyledContainer elevation={6}>
			<StyledRow justifyContent={"space-between"} gap={"1rem"}>
				<StyledColumn justifyContent={"center"}>
					{" "}
					<StyledOrderButton>{order?.orderId ? order.orderId : "New Order"}</StyledOrderButton>
					<StyledProductButton>{product && `${product.name} (${product.id})`}</StyledProductButton>
				</StyledColumn>

				<StyledColumn flex={"1"} justifyContent={"center"}>
					{order && (
						<ProgressBar
							total={order.orderTotal}
							current={order.orderCount}
							label
							unitAlias="device"
							placement="top-end"
						/>
					)}
				</StyledColumn>
			</StyledRow>
			<StyledColumn gap=".5rem">
				<Divider style={{ width: "100%" }} />
				<Divider style={{ width: "100%" }} />
			</StyledColumn>
			<InputForm {...{product, order}}/>
		</StyledContainer>
	);
};

const InputForm = ({order}: ReturnType<typeof useCurrentOrder>)=> {
	const ctx = useForm()
	const activeInputs = useSelector((state: AppState) => state.root.activeInputs)
	return (
		<form>
			<StyledColumn gap={"1rem"}>
				
			</StyledColumn>
		</form>
	);
}

const InputField = ({input: Input}) => {
	return <TextField />;
}

const StyledOrderButton = styled(ButtonBase)(({ theme }) => ({
    padding: ".2rem .5rem",
    color: theme.palette.grey[700],
    textTransform: "none",
    fontSize: "2rem"
}));

const StyledProductButton = styled(ButtonBase)(({ theme }) => ({
    padding: ".2rem .5rem",
    color: theme.palette.grey[700],
    textTransform: "uppercase",
    fontSize: ".75rem"
}));

const StyledContainer = styled(Paper)(({ theme }) => ({
	minWidth: "300px",
	padding: theme.spacing(2),
	gap: theme.spacing(2),
	display: "flex",
	flexDirection: "column"
}))