/** @jsxImportSource @emotion/react */
import {
    forwardRef,
    PropsWithChildren,
    ReactNode,
    useCallback,
    useImperativeHandle,
    useState,
} from "react";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { css } from "@emotion/react";

const collapseIconStyle = css`
    margin-right: 8px;
    position: relative;
    top: 2px;
    font-size: 13px;
    opacity: 0.5;
    cursor: pointer;
`;

const collapseBeforeStyle = css``;

const collapseAfterStyle = css`
    ${collapseBeforeStyle}
`;

const placeholderStyle = css`
    margin: 0 8px;

    ::after {
        content: attr(data-content);
    }
`;

const metaStyle = css`
    margin-left: 12px;
    opacity: 0.5;
    font-size: 13px;

    ::after {
        content: attr(data-content);
    }
`;

const hiddenStyle = css`
    display: inline-block;
    overflow: hidden;
    width: 1px;
    height: 1px;
`;

export type CollapsibleRef = {
    toggle: () => void;
};

export type CollapsibleProps = PropsWithChildren<{
    before: ReactNode;
    after: ReactNode;
    placeholder?: string;
    meta?: string;
}>;

export const CollapsibleValue = forwardRef<CollapsibleRef, CollapsibleProps>(
    (props, ref) => {
        const {
            before,
            after,
            placeholder = "…",
            meta = null,
            children,
        } = props;

        const [collapsed, setCollapsed] = useState<boolean>(false);

        useImperativeHandle(
            ref,
            () => ({
                toggle: () => setCollapsed(!collapsed),
            }),
            [collapsed]
        );

        const handleClick = useCallback(() => {
            setCollapsed(!collapsed);
        }, [collapsed]);

        const metaEl = (
            // render meta content via data attribute using ::after (see `metaStyle`)
            // to prevent it to be copied when copying selecting text
            <span css={metaStyle} onClick={handleClick} data-content={meta} />
        );

        return (
            <>
                <span onClick={handleClick}>
                    {collapsed ? (
                        <AddCircleOutline css={collapseIconStyle} />
                    ) : (
                        <RemoveCircleOutline css={collapseIconStyle} />
                    )}
                    <span css={collapseBeforeStyle}>{before}</span>
                    {!collapsed && <span>{metaEl}</span>}
                    {collapsed && (
                        <span
                            css={placeholderStyle}
                            data-content={placeholder}
                        />
                    )}
                </span>
                <div css={collapsed && hiddenStyle}>{children}</div>
                <span onClick={handleClick}>
                    <span css={collapseAfterStyle}>{after}</span>
                    {collapsed && metaEl}
                </span>
            </>
        );
    }
);

CollapsibleValue.displayName = "CollapsibleValue";
