/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import LoadingSpinner from "../assets/loading.gif";

const spinnerStyle = css`
	width: 40px;
`;

const Spinner = () => {
	return <img src={LoadingSpinner} css={spinnerStyle} />;
};

export default Spinner;
