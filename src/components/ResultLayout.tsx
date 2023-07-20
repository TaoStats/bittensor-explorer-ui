/** @jsxImportSource @emotion/react */
import { Outlet, useLoaderData } from "react-router-dom";
import { css, Theme } from "@emotion/react";

import Logo from "../assets/logo.png";
import Background from "../assets/detail-page-bgr.svg";

import { Network } from "../model/network";

import { NotFoundPage } from "../screens/notFound";

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
	box-sizing: border-box;
	z-index: 1000;

	flex: 0 0 auto;

	background-color: ${theme.palette.primary.dark};

	${theme.breakpoints.up("md")} {
		margin: 0 -32px;
		margin-top: -24px;
		padding: 2.5rem 4rem;
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
	max-width: 1500px;
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

const searchInputStyle = (theme: Theme) => css`
  flex: 1 1 auto;

  .MuiInputBase-root {
    .MuiInputBase-input,
    .MuiSelect-select {
      padding: 16px 24px;
    }
  }

  ${theme.breakpoints.up("md")} {
    .MuiButton-root {
      padding-left: 52px;
      padding-right: 52px;
    }
  }
`;

const footerStyle = (theme: Theme) => css`
	flex: 0 0 auto;

  background-color: ${theme.palette.primary.dark};

  > div {
    max-width: 1000px;
  }
`;

export type ResultLayoutLoaderData = {
	network?: Network;
};

export const ResultLayout = () => {
	const {network} = useLoaderData() as ResultLayoutLoaderData;

	return (
		<div css={containerStyle}>
			<div css={backgroundStyle} data-test="background" />
			<div css={contentWrapperStyle}>
				<div css={topBarStyle} data-test="top-bar">
					<div css={topBarContentStyle}>
						<Link to='/'>
							<img src={Logo} css={logoStyle} />
						</Link>
						<div css={topBarRowStyle}>
							<SearchInput css={searchInputStyle} defaultNetwork={network?.name} key={network?.name} />
						</div>
					</div>
				</div>
				<div css={contentStyle}>
					{network && <Outlet />}
					{!network && <NotFoundPage />}
				</div>
			</div>
			<Footer css={footerStyle} />
		</div>
	);
};
