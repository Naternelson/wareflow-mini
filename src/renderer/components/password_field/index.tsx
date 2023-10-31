import React, { ForwardedRef, forwardRef } from "react";
import { ClickAwayListener, IconButton, InputAdornment, TextField, TextFieldProps } from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const PasswordField = forwardRef((props: TextFieldProps, ref: ForwardedRef<HTMLDivElement>) => {
	const { type: _type, InputProps, ...textFieldProps } = props;
	const { type, onClickHandler, onCloseHandler } = usePasswordConfig();

	return (
		<ClickAwayListener onClickAway={onCloseHandler}>
			<TextField
				{...textFieldProps}
                ref={ref}
				type={type}
				InputProps={{
					...InputProps,
					endAdornment: <PasswordAdornment type={type} onClick={onClickHandler} />,
				}}
			/>
		</ClickAwayListener>
	);
});

const PasswordAdornment = (props: { type: "password" | "text"; onClick: () => void }) => {
	const { type, onClick } = props;
	return (
		<InputAdornment position="end">
			<IconButton onClick={onClick}>{type === "password" ? <Visibility /> : <VisibilityOff />}</IconButton>
		</InputAdornment>
	);
};

const usePasswordConfig = () => {
	const [type, setType] = useState<"password" | "text">("password");
	const onClickHandler = () => {
		setType(type === "password" ? "text" : "password");
	};
	const onCloseHandler = () => {
		setType("password");
	};
	return {
		type,
		onClickHandler,
		onCloseHandler,
	};
};
