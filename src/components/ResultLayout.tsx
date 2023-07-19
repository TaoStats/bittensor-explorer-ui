/** @jsxImportSource @emotion/react */
import { Outlet } from "react-router-dom";
import { css, Theme } from "@emotion/react";

import Background from "../assets/detail-page-bgr.svg";
import { ReactComponent as Logo } from "../assets/calamar-logo-export-02.svg";

import SearchInput from "./SearchInput";
import { Link } from "./Link";
import { Footer } from "./Footer";

const containerStyle = (theme: Theme) => css`
	--content-wrapper-min-height: 450px;

	display: flex;
	flex-direction: column;
	align-items: center;

	${theme.breakpoints.up("sm")} {
		--content-wrapper-min-height: 500px;
	}

	${theme.breakpoints.up("md")} {
		--content-wrapper-min-height: 600px;
	}

	${theme.breakpoints.up("lg")} {
		--content-wrapper-min-height: 750px;
	}

	${theme.breakpoints.up("xl")} {
		--content-wrapper-min-height: 1250px;
	}
`;

const backgroundStyle = css`
	position: absolute;
	left: 0;
	margin: 0;
	width: 100%;
	height: 100%;
	min-height: 100vh;
	z-index: -1;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: var(--content-wrapper-min-height);
		background-color: white;
		background-position: center bottom;
		background-size: 100% auto;
		background-repeat: no-repeat;
		background-image: url(${Background});
	}

	&::after {
		content: '';
		position: absolute;
		top: var(--content-wrapper-min-height);
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #def9fb;
	}
`;

const topBarStyle = (theme: Theme) => css`
	position: relative;
	top: 0;
	padding: 16px;
	margin: 0 -16px;
	margin-top: -16px;
	min-height: 130px;
	box-sizing: border-box;
	z-index: 1000;

	flex: 0 0 auto;

	${theme.breakpoints.up("md")} {
		margin: 0 -32px;
		margin-top: -24px;
		padding: 0 32px;
		padding-top: 24px;
	}
`;

const topBarContentStyle = (theme: Theme) => css`
	max-width: 1500px;
	margin: auto;
	display: flex;
	flex-direction: column;

	${theme.breakpoints.up("md")} {
		flex-direction: row;
		align-items: center;
	}
`;

const topBarRowStyle = css`
	display: flex;
	align-items: center;
	flex: 1 1 auto;
`;

const contentWrapperStyle = (theme: Theme) => css`
	position: relative;
	padding: 16px;
	width: 100%;
	box-sizing: border-box;
	flex: 1 1 auto;

	min-height: var(--content-wrapper-min-height);

	${theme.breakpoints.up("md")} {
		padding: 24px 32px;
	}
`;

const contentStyle = css`
	max-width: 1500px;
	margin: auto;
	margin-top: 40px;
`;

const logoStyle = (theme: Theme) => css`
	margin-right: auto;

	> svg {
		display: block;
		width: 250px;
	}

	${theme.breakpoints.down("md")} {
		margin-bottom: 12px;

		> svg {
			width: 160px;
		}
	}
`;

const searchInputStyle = css`
	width: 100%;
	flex: 1 1 auto;
`;

const footerStyle = css`
	> div {
		max-width: 1500px;
	}
`;

export const ResultLayout = () => {
	return (
		<div css={containerStyle}>
			<div css={backgroundStyle} data-test="background" />
			<div css={contentWrapperStyle}>
				<div css={topBarStyle} data-test="top-bar">
					<div css={topBarContentStyle}>
						<div css={topBarRowStyle}>
							<Link css={logoStyle} to="/">
								<Logo />
							</Link>
						</div>
						<div css={topBarRowStyle}>
							<SearchInput css={searchInputStyle} />
						</div>
					</div>
				</div>
				<div css={contentStyle}>
					<Outlet />
				</div>
			</div>
			<Footer css={footerStyle} />
		</div>
	);
};
