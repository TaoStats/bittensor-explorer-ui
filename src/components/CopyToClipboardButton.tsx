/** @jsxImportSource @emotion/react */
import { useCallback, useState } from "react";
import { IconButton, IconButtonProps, Tooltip } from "@mui/material";
import { css, Theme } from "@emotion/react";

const buttonStyle = (theme: Theme) => css`
	padding: 0;
	color: ${theme.palette.success.dark};
`;

export type CopyToClipboardButtonProps = Omit<IconButtonProps, "value"|"size"> & {
	value: string|null|undefined;
	size?: "normal"|"small";
}

const CopyToClipboardButton = (props: CopyToClipboardButtonProps) => {
	const {value, size = "normal", ...restProps} = props;

	const [copied, setCopied] = useState(false);

	const copyToClipboard = useCallback(async () => {
		if (!value) {
			return;
		}

		await navigator.clipboard.writeText(value);

		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 1000);
	}, [value]);

	return (
		<Tooltip
			arrow
			disableHoverListener
			open={copied}
			placement="top"
			title="Copied"
		>
			<IconButton
				{...restProps}
				css={buttonStyle}
				onClick={copyToClipboard}
				data-class="copy-button"
			>
				{size === "normal" && (
					<svg
						height="20"
						viewBox="0 0 20 20"
						width="20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M15 5v-5h-15v15h5v5h15v-15h-5z m-10 8h-3v-11h11v3h-8v8z m13 5h-11v-11h11v11z"
							fill="currentColor"
						/>
					</svg>
				)}
				{size === "small" && (
					<svg
						height="16"
						viewBox="0 0 16 16"
						width="16"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M12 4v-4h-12v12h4v4h12v-12h-4z m-8 6h-2v-8h8v2h-6v6z m10 4h-8v-8h8v8z"
							fill="currentColor"
						/>
					</svg>
				)}
			</IconButton>
		</Tooltip>
	);
};
export default CopyToClipboardButton;
