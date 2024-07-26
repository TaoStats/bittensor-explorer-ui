/** @jsxImportSource @emotion/react */
import { css } from "@mui/material";
import { Theme } from "@emotion/react";
import { Pagination, usePagination } from "../../hooks";

const paginationStyle = css`
    display: flex;
    margin-bottom: 16px;
    padding: 0 0 0 20px;
    font-size: 14px;
    @media (max-width: 767px) {
        flex-direction: column;
        gap: 5px;
    }
`;

const showStyle = () => css`
    display: flex;
    gap: 10px;
`;

const showLabelStyle = (theme: Theme) => css`
    color: ${theme.palette.secondary.main};
    margin-right: 5px;
`;

const showItemStyle = (theme: Theme) => css`
    color: ${theme.palette.secondary.main};
    cursor: pointer;
`;

const showItemSelectedStyle = (theme: Theme) => css`
    color: ${theme.palette.secondary.light};
    cursor: pointer;
`;

type TablePaginationProps = Pagination;

export function TablePaginationHeader(props: TablePaginationProps) {
    const { limit, set: setPaginationOptions } = props;
    const { pageSizes } = usePagination();

    return (
        <div css={paginationStyle}>
            <div css={showStyle}>
                <label css={showLabelStyle}>Show</label>
                {pageSizes.map((size, index) => (
                    <div
                        css={
                            size === limit
                                ? showItemSelectedStyle
                                : showItemStyle
                        }
                        key={index}
                        onClick={() =>
                            setPaginationOptions({
                                ...props,
                                offset: 1,
                                page: 1,
                                prevEndCursor: [],
                                limit: size,
                            })
                        }
                    >
                        {size}
                    </div>
                ))}
            </div>
        </div>
    );
}
