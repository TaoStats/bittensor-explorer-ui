/** @jsxImportSource @emotion/react */
import { FaDiscord } from "react-icons/fa";
import { Twitter } from "@mui/icons-material";
import { css, Theme } from "@emotion/react";
import { HTMLAttributes } from "react";

const footerStyle = css`
	box-sizing: border-box;
	width: 100%;
	padding: 24px;
	padding-top: 48px;
	padding-bottom: 64px;
`;

const contentStyle = (theme: Theme) => css`
	display: flex;
	box-sizing: border-box;
	justify-content: space-between;
	margin: 0 auto;
	padding: 0 16px;
	align-items: center;
	gap: 52px;

	width: 100%;

	z-index: 100;

	font-size: 13px;

	a {
		color: ${theme.palette.success.main};
		text-decoration: none;
	}

	a:hover {
		color: ${theme.palette.success.light};
	}

	${theme.breakpoints.down("md")} {
		flex-direction: column-reverse;
		gap: 16px;
	}
`;

const creditsStyle = css`
	display: flex;
	align-items: center;

	> div {
		text-align: center;
	}

	a {
		font-weight: 600;
	}
`;

const separatorStyle = css`
	display: inline-block;
	width: 1px;
	height: 10px;
	background-color: currentColor;
	margin: 0 16px;
	margin-top: 2px;
	opacity: .75;
`;

const linksStyle = css`
	display: flex;
	padding: 0 8px;
	width: fit-content;
	align-items: center;
	gap: 2rem;
	z-index: 10;
`;

const iconStyle = css`
	display: block;
	font-size: 1.25em;
`;

export const Footer = (props: HTMLAttributes<HTMLDivElement>) => {
	return (
		<div css={footerStyle} {...props}>
			<div css={contentStyle}>
				<div css={creditsStyle}>
					<div>Created by <a href="https://taostats.io">Taostats</a></div>
					<div css={separatorStyle}></div>
					<div>Built on <a href="https://bittensor.com">Bittensor</a></div>
				</div>
				<div css={linksStyle}>
					<a href="https://twitter.com/taostats">
						<Twitter css={iconStyle} />
					</a>
					<a href="https://discord.com/channels/1086368192521318472/1086369375411507290">
						<FaDiscord css={iconStyle} />
					</a>
				</div>
			</div>
		</div>
	);
};
