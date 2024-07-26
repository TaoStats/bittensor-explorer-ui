/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import LoadingSpinner from "../../assets/loading.svg";

const smallSpinnerStyle = css`
    width: 40px;
`;

interface SpinnerProps {
    small?: boolean;
}

export const Spinner = ({ small }: SpinnerProps) => {
    return <img src={LoadingSpinner} css={small && smallSpinnerStyle} />;
};
