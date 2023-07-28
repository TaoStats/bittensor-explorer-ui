/** @jsxImportSource @emotion/react */
import { Outlet } from "react-router-dom";
import { css, Theme } from "@emotion/react";

import Logo from "../assets/logo.png";

import SearchInput from "./SearchInput";
import { Link } from "./Link";
import { Footer } from "./Footer";

const containerStyle = (theme: Theme) => css`
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: ${theme.palette.primary.main};
	color: ${theme.palette.text.primary};
`;

const topBarStyle = (theme: Theme) => css`
	position: relative;
	top: 0;
	padding: 16px;
	margin: 0 -16px;
	margin-top: -16px;
	margin-left: auto;
	margin-right: auto;
	box-sizing: border-box;
	z-index: 1000;
	max-width: 1800px;

	flex: 0 0 auto;

	${theme.breakpoints.up("md")} {
		margin: 0 -32px;
		margin-top: -24px;
		margin-left: auto;
		margin-right: auto;
		padding: 2.5rem 0px;
		padding-left: 68px;
	}
`;

const topBarContentStyle = (theme: Theme) => css`
	margin: auto;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: column;

	${theme.breakpoints.up("md")} {
		flex-direction: row;
	}
`;

const topBarRowStyle = css`
	display: flex;
	max-width: 1000px;
	min-width: 45%;
	text-align: center;
	justify-content: center;
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
	max-width: 1800px;
	margin: auto;
	margin-top: 40px;
`;

const logoStyle = (theme: Theme) => css`
	margin-right: auto;
	display: block;
	width: 120px;

	${theme.breakpoints.down("md")} {
		margin-bottom: 12px;
	}
`;

const searchInputStyle = css`
  flex: 1 1 auto;

  .MuiInputBase-root {
    .MuiInputBase-input,
    .MuiSelect-select {
      padding: 12px 24px;
			font-size: 15px;
			font-weight: 300;
    }
  }

	.MuiButton-root {
		text-transform: uppercase;
		color: black;
	}
`;

const footerStyle = css`
	flex: 0 0 auto;

  > div {
    max-width: 1500px;
  }
`;

export const ResultLayout = () => {
	return (
		<div css={containerStyle}>
			<div css={contentWrapperStyle}>
				<div css={topBarStyle} data-test="top-bar">
					<div css={topBarContentStyle}>
						<Link to='/'>
							<img src={Logo} css={logoStyle} />
						</Link>
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
