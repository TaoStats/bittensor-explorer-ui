/** @jsxImportSource @emotion/react */
import { Outlet } from "react-router-dom";
import { css, Theme } from "@emotion/react";

import { Footer } from "./Footer";
import { Header } from "./Header";

const containerStyle = (theme: Theme) => css`
    min-height: 100vh;
    background-color: ${theme.palette.primary.main};
    color: ${theme.palette.text.primary};
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

export const ResultLayout = () => {
    return (
        <div css={containerStyle}>
            <div className="blur-overlay" />
            <Header />
            <div css={contentWrapperStyle}>
                <div css={contentStyle}>
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    );
};
