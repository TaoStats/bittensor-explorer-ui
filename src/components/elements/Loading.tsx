/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { Spinner } from "./Spinner";

const loadingStyle = css`
    text-align: center;
`;

export const Loading = () => {
    return (
        <div css={loadingStyle}>
            <Spinner />
        </div>
    );
};
