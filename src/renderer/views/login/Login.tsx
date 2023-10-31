import React, { useEffect, useState } from "react";
import {  Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { PasswordField } from "../../components";
import { useForm, useFormContext } from "react-hook-form";
import { SigninUserBody } from "../../../common";
import { FormProvider } from "react-hook-form";
import { signin } from "../../store/slices/auth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/slices";

export const LoginPage = () => {
	const { status, onSubmit, ...res } = useLoginForm();
	const disabled = status === "pending";
	return (
		<Stack maxWidth={"300px"} margin={"2rem auto"}>
			<FormProvider {...res}>
				<form onSubmit={onSubmit}>
					<Stack direction={"column"} spacing={2}>
						<Typography variant="h3" textAlign={"center"}>
							Login
						</Typography>
                        <Divider />
						<EmailField />
						<Password />
						<Button variant="contained" color="primary" type="submit" disabled={disabled}>
							Login
						</Button>
					</Stack>
				</form>
			</FormProvider>
		</Stack>
	);
};

const EmailField = () => {
	const { register, formState: {errors} } = useFormContext<SigninUserBody>();
    const error = errors.email?.message;
	return (
		<TextField
			size="small"
			variant="outlined"
			type="email"
			label="Email"
			aria-label="email"
            error={!!error}
            helperText={error}
			{...register("email", {
				required:{
                    value: true,
                    message: "Email is required",
                },
				pattern: {
					value: /\S+@\S+\.\S+/,
					message: "Entered value does not match email format",
				},
			})}
		/>
	);
};

const Password = () => {
    const { register, formState: {errors} } = useFormContext<SigninUserBody>();
    const error = errors.password?.message;
    return (
		<PasswordField
			label="Password"
			variant="outlined"
			size="small"
			aria-label="password"
			error={!!error}
			helperText={error}
			{...register("password", {
				required: {
					value: true,
					message: "Password is required",
				},
				minLength: {
					value: 8,
					message: "Password must be at least 8 characters long",
				},
				maxLength: {
					value: 20,
					message: "Password must be at most 20 characters long",
				},
				pattern: {
					value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+,-./:;<=>?@[\]^`{|}~]{8,}$/,
					message:
						"Password must contain at least one uppercase letter, one lowercase letter, and one number",
				},
			})}
		/>
	);
}

const useLoginForm = () => {
	const [status, setStatus] = useState<"idle" | "pending" | "failed" | "success">("idle");
    const id = useSelector<RootState>(r => r.auth.organization?.id )
	const dispatch = useDispatch<AppDispatch>()
    const nav = useNavigate()
	const res = useForm<SigninUserBody>({
		defaultValues: {
			email: "",
			password: "",
			organizationId: null,
		},
	});

	const onSubmit = res.handleSubmit(async (data) => {
		try {
			const d = await dispatch(signin({body: data }));

            console.log(d);
            d.type === signin.fulfilled.type && setStatus("success");
            d.type === signin.rejected.type && setStatus("failed");
		} catch (error) {
			setStatus("failed");
		}
	});

    useEffect(() => {
        if (status === "success" && id) {
            nav(`/${id}`)
        }
    },[status, id, nav])
	return { ...res, status, onSubmit };
};
