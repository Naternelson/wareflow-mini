import { Box, Button, Divider, Paper, Stack, Typography, styled } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/slices";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { FormFields } from "./types";
import { GlobalOrderFields } from "./GlobalFields";
import { OrderIdentifiers } from "./OrderIdentifiers";
import { OrderItems } from "./OrderItems";
import { useEffect, useState } from "react";
import { NewOrderRequestBody, OrderItemStatus } from "../../../common";
import { AppDispatch } from "../../store";
import { getProducts } from "../../store/slices/products";
import { newOrder } from "../../store/slices/orders";
import { wait } from "../../utility/wait";
import { LoaderRipple } from "../../components";
import { useNavigate } from "react-router-dom";
import { LoaderText } from "../../components/loader_text";

export const OrdersNewPage = () => {
	const { onSubmit, form, loading, success } = useNewOrderFormHook();
	return (
		<Box>
			<StyledPaper elevation={3} className={["fadeup", loading && "loading"].filter(el=>!!el).join(" ")}>
				{loading && !success && <LoaderRipple/>}
				{success && <LoaderText text="Order Created Successfully"/>}
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<FormProvider {...form}>
						<form onSubmit={onSubmit}>
							<Stack spacing={2}>
								<Box>
									<Typography
										variant="overline"
										component={"h3"}
										fontSize={"1.25rem"}
										fontStyle={"italic"}>
										Create Order
									</Typography>
									<Divider />
								</Box>
								<GlobalOrderFields />
                                <Divider />
								<OrderIdentifiers />
                                <Divider/>
                                <OrderItems/>
								<Button type="submit" variant="contained" color="primary">
									Create Order
								</Button>
							</Stack>
						</form>
					</FormProvider>
				</LocalizationProvider>
			</StyledPaper>
		</Box>
	);
};

const StyledPaper = styled(Paper)(({ theme }) => ({
	margin: "1rem auto",
	padding: "2rem",
	width: "100%",
	maxWidth: "800px",
}));

const useNewOrderFormHook = () => {
	const organizationId = useSelector<RootState, number | undefined>((state) => state.auth.organization?.id);
	const status = useSelector<RootState, string | undefined>((state) => state.products.status);
	const dispatch = useDispatch<AppDispatch>();
	const nav = useNavigate()
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false)
	const frm = useForm<FormFields>({
        mode: "onTouched",
		defaultValues: {
			organizationId,
			orderedOn: dayjs(new Date()),
			dueBy: dayjs(new Date()),
			customer: "",
			items: [{
				unit: "unit",
				productId: undefined, 
				quantity: 1,
				status: OrderItemStatus.PENDING,
			}],
			identifiers: [
				{
					name: "",
					value: "",
					primary: true,
				},
			],
		},
	});
	const onSumbit = frm.handleSubmit(async(data) => {
		const newOrderRequest: NewOrderRequestBody = {
			...data,
			orderedOn: data.orderedOn.toDate(),
			dueBy: data.dueBy.toDate(),
		}
		setLoading(true)
		try {
			const result = await dispatch(newOrder({body: newOrderRequest}))
			const id = result.payload?.data?.id;
			setSuccess(true)
			await wait(2000)
			nav(`../orders/${id}/build`, {state: {newOrderRequest}})
		} catch (error) {
			console.error(error)
			setSuccess(false)
			setLoading(false)
		}
		
	});

    useEffect(() => {
        // Get Products
		const fn = () => {
			if(status === "idle" && organizationId) {
				dispatch(getProducts({ body: { organizationId } }));
			}
		}
		fn();
    },[dispatch, status, organizationId])

	return {
		form: frm,
		onSubmit: onSumbit,
		productsStatus: status,
		loading,
		success
	};
};
