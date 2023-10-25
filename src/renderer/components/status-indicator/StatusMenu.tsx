import React, { useState } from "react";
import { ButtonBase, Menu, MenuItem } from "@mui/material";
// import { OrderStatus } from "../../../common/order";
// import { StatusIndicator } from "./StatusIndicator";

// // Define the props for the StatusMenu component
// type StatusMenuProps = {
// 	value: OrderStatus;
// 	onChange: (value: OrderStatus) => void;
// 	allowedValues?: OrderStatus[];
// };

// // Define the possible order statuses
// const SortedStatuses = [
// 	OrderStatus.QUEUED,
// 	OrderStatus.PICKING,
// 	OrderStatus.ASSEMBLY,
// 	OrderStatus.PAUSED,
// 	OrderStatus.ERROR,
// 	OrderStatus.COMPLETED,
// 	OrderStatus.CANCELLED,
// 	OrderStatus.DELIVERED,
// ];

// export const StatusMenu: React.FC<StatusMenuProps> = (props) => {
// 	// Use custom hook for managing state and logic
// 	const { open, handleOpen, handleClose, anchorEl, handleChange } = useStatusMenuHooks(props.onChange);

// 	// Props for ButtonBase
// 	const buttonBaseProps: React.ComponentProps<typeof ButtonBase> = {
// 		onClick: handleOpen,
// 		"aria-controls": "status-menu",
// 		"aria-haspopup": "true",
// 		"aria-expanded": open ? "true" : undefined,
// 	};

// 	// Props for Menu
// 	const menuProps: React.ComponentProps<typeof Menu> = {
// 		id: "status-menu",
// 		anchorEl: anchorEl,
// 		open: open,
// 		onClose: handleClose,
// 		MenuListProps: {
// 			dense: true,
// 			"aria-labelledby": "status-button",
// 		},
// 	};

// 	// Filter permitted statuses based on allowedValues prop
// 	const permittedStatuses = props.allowedValues
// 		? SortedStatuses.filter((status) => props.allowedValues?.includes(status))
// 		: SortedStatuses;

// 	return (
// 		<>
// 			<ButtonBase {...buttonBaseProps}>
// 				<StatusIndicator status={props.value} />
// 			</ButtonBase>
// 			<Menu {...menuProps}>
// 				{/* Render menu items */}
// 				{permittedStatuses.map((status) => (
// 					<MenuItemStatus status={status} handleChange={handleChange} key={status} />
// 				))}
// 			</Menu>
// 		</>
// 	);
// };

// // Component for individual menu items
// const MenuItemStatus: React.FC<{
// 	status: OrderStatus;
// 	handleChange: StatusMenuProps["onChange"];
// }> = ({ status, handleChange }) => {
// 	// Props for MenuItem
// 	const menuItemProps: React.ComponentProps<typeof MenuItem> = {
// 		value: status,
// 		key: status,
// 		onClick: (e) => {
// 			e.stopPropagation(); // Prevent event propagation
// 			handleChange(status); // Trigger the status change
// 		},
// 	};

// 	return (
// 		<MenuItem {...menuItemProps}>
// 			<StatusIndicator status={status} />
// 		</MenuItem>
// 	);
// };

// // Custom hook for managing state and logic
// const useStatusMenuHooks = (onChange: StatusMenuProps["onChange"]) => {
// 	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
// 	const open = Boolean(anchorEl);

// 	const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
// 		setAnchorEl(e.currentTarget);
// 	};

// 	const handleClose = () => {
// 		setAnchorEl(null);
// 	};

// 	const handleChange = (status: OrderStatus) => {
// 		onChange(status);
// 		handleClose();
// 	};

// 	return {
// 		open,
// 		handleOpen,
// 		handleClose,
// 		anchorEl,
// 		handleChange,
// 	};
// };
