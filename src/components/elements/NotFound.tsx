/** @jsxImportSource @emotion/react */
import { HTMLAttributes } from "react";
import { css } from "@emotion/react";

const notFoundMessageStyle = css`
    padding: 16px 0;
    text-align: center;
`;

type NotFoundProps = HTMLAttributes<HTMLDivElement>;

export const NotFound = (props: NotFoundProps) => {
    const { children, ...divProps } = props;

    return (
        <div css={notFoundMessageStyle} data-test="not-found" {...divProps}>
            {children}
        </div>
    );
};
