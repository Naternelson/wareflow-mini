import { Add } from "@mui/icons-material";
import { Box, Typography, styled, Paper, FormControl, InputLabel, Select, MenuItem, Button, TextField } from "@mui/material";
import { useState } from "react";

export const HomeView = () => {
	const [product, setProduct] = useState("10");

	return (
		<PageContainer>
			<CenteredRow>
				<Typography variant="h6" component={"h1"}>
					Device Input
				</Typography>
			</CenteredRow>
			<FormContainer elevation={5}>
				<form>
					<FormContents>
						<CenteredRow></CenteredRow>
						<BoxRow style={{gap: "1rem", justifyContent: "space-between"}}>
							<FormControl size="small" style={{minWidth: "60%"}}>
								<InputLabel>Order</InputLabel>
								<Select
									placeholder="Select Product"
									value={product}
									label="Product"
									onChange={(e) => setProduct(e.target.value)}>
									<MenuItem dense selected={product === "10"} value={"10"}>
										10
									</MenuItem>
									<MenuItem selected={product === "11"} value={"11"}>
										11
									</MenuItem>
								</Select>
							</FormControl>
							<Button size="small" variant="contained" startIcon={<Add fontSize="small" />}>
								New Order
							</Button>
						</BoxRow>
						<BoxRow>Order Details</BoxRow>
						<BoxRow>Product Details</BoxRow>
                        <BoxRow>
                            <TextField label="Device ID" focused/>
                        </BoxRow>
					</FormContents>
				</form>
			</FormContainer>

		</PageContainer>
	);
};

const PageContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	height: "100vh",
	width: "100vw",
	backgroundColor: theme.palette.background.default,
}));

const CenteredRow = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	justifyContent: "center",
}));

const BoxRow = styled(Box)(() => ({
	display: "flex",
	flexDirection: "row",
}));

const FormContainer = styled(Paper)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	backgroundColor: theme.palette.background.paper,
	padding: theme.spacing(2),
	minWidth: "33vw",
}));

const BoxColumn = styled(Box)(() => ({
	display: "flex",
	flexDirection: "column",
}));


const FormContents = styled(Box)(({theme}) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2)
}))