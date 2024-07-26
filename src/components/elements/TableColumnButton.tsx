/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Button, ButtonProps } from "@mui/material";

const buttonStyle = css`
	position: relative;
	top: -1px;
	padding-left: 10px;
	min-width: 0;
	margin: -5px 0;
	margin-left: 10px;

	font-size: 13px;

	.MuiButton-startIcon {
		margin-left: -5px;
		margin-right: 2px;

		> svg {
			font-size: 15px;
		}
	}
`;

const iconOnlyStyle = css`
	.MuiButton-startIcon {
		margin-right: -5px;
	}
`;

const emptyTextStyle = css`
	width: 0;
`;

export type TableColumnButtonProps = Omit<ButtonProps, "startIcon"|"endIcon"> & {
	icon: ButtonProps["startIcon"]
}

export const TableColumnButton = (props: TableColumnButtonProps) => {
	const {icon, children, ...buttonProps} = props;

	return (
		<Button
			size="small"
			css={[buttonStyle, !children && iconOnlyStyle]}
			startIcon={icon}
			{...buttonProps}
		>
			{children || <span css={emptyTextStyle}>&nbsp;</span>}
		</Button>
	);
};
