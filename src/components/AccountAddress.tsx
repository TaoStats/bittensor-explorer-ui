/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import { Tooltip } from "@mui/material";
import { css, Theme } from "@emotion/react";

import { encodeAddress } from "../utils/formatAddress";
import { shortenHash } from "../utils/shortenHash";

import { Link } from "./Link";
import { AccountAvatar } from "./AccountAvatar";
import CopyToClipboardButton, { CopyToClipboardButtonProps } from "./CopyToClipboardButton";

const accountAddressStyle = css`
	display: inline-flex;
	align-items: center;
`;

const linkStyle = (theme: Theme) => css`
color: ${theme.palette.neutral.main} !important;
`;

const iconStyle = css`
	margin-right: 8px;
`;

const copyToClipboardStyle = css`
	margin-left: 8px;
`;

export type AccountLinkProps = {
	address: string;
	prefix: number;
	icon?: boolean;
	link?: boolean;
	shorten?: boolean;
	copyToClipboard?: CopyToClipboardButtonProps["size"];
}

export const AccountAddress = (props: AccountLinkProps) => {
	const {
		address,
		prefix,
		icon = true,
		link = true,
		shorten,
		copyToClipboard
	} = props;

	const encodedAddress = useMemo(() => encodeAddress(address, prefix), [address]);

	const content = useMemo(() => {
		let content = <span>{shorten ? shortenHash(encodedAddress) : encodedAddress}</span>;

		if (link) {
			content = (
				<Link to={`/account/${address}`} css={linkStyle}>
					{content}
				</Link>
			);
		}

		if (shorten) {
			content = (
				<Tooltip
					arrow
					placement="top"
					enterTouchDelay={0}
					title={encodedAddress}
				>
					{content}
				</Tooltip>
			);
		}

		return content;
	}, [address, encodeAddress, link]);

	/*if (!icon) {
		return <>{content}</>;
	}*/

	return (
		<div css={accountAddressStyle}>
			{icon && (
				<AccountAvatar
					css={iconStyle}
					address={address}
					prefix={prefix}
					size={20}
				/>
			)}
			{content}
			{copyToClipboard && (
				<CopyToClipboardButton
					css={copyToClipboardStyle}
					value={encodedAddress}
					size={copyToClipboard}
				/>
			)}
		</div>
	);
};
