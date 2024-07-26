/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import { Theme, css } from "@mui/material";
import { Pagination } from "../../hooks";
import { formatNumber } from "../../utils";

const paginationStyle = css`
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
    padding: 0 0 0 10px;
    font-size: 14px;
    @media (max-width: 999px) {
        flex-direction: column;
        gap: 5px;
    }
`;

const pagesStyle = css`
    display: flex;
    gap: 3px;
`;

const disabledPageStyle = (theme: Theme) => css`
    color: ${theme.palette.secondary.main};
    padding: 0 10px;
`;

const pageStyle = (theme: Theme) => css`
    color: ${theme.palette.secondary.main};
    cursor: pointer;
    padding: 0 10px;

    &:hover {
        color: ${theme.palette.secondary.light};
    }
`;

const activePage = (theme: Theme) => css`
    color: ${theme.palette.secondary.light};
`;

const inactivePage = (theme: Theme) => css`
    color: ${theme.palette.secondary.main};
    cursor: pointer;

    &:hover {
        color: ${theme.palette.secondary.light};
    }
`;

const disabledPage = (theme: Theme) => css`
    color: ${theme.palette.secondary.main};
`;

type TablePaginationProps = Pagination;

type PageNavProps = {
    disabled: boolean;
};

export function TablePagination(props: TablePaginationProps) {
    const {
        hasNextPage,
        hasPreviousPage,
        page,
        limit,
        offset,
        setNextPage,
        setPreviousPage,
        setPage,
        totalCount,
        pageNumbers,
    } = props;

    const PrevPage = ({ disabled }: PageNavProps) => {
        return (
            <div
                css={disabled ? disabledPageStyle : pageStyle}
                onClick={() => !disabled && setPreviousPage()}
            >
                &#9664; Previous
            </div>
        );
    };

    const NextPage = ({ disabled }: PageNavProps) => {
        return (
            <div
                css={disabled ? disabledPageStyle : pageStyle}
                onClick={() => !disabled && setNextPage()}
            >
                Next &#9654;
            </div>
        );
    };

    const startOffset = Math.min(offset, totalCount ?? 0);
    const endOffset = Math.min(offset + limit - 1, totalCount ?? 0);
    const maxPage = Math.ceil((totalCount ?? 1) / limit);

    const availablePages = useMemo(() => {
        const pages: number[] = [];

        const adjust = Math.max(Math.min(page, maxPage - 2), 3);
        let left = Math.max(adjust - 2, 1),
            right = Math.min(adjust + 2, maxPage);

        if (left <= 3) left = 1;
        else {
            pages.push(1);
            pages.push(-1);
        }
        if (right >= maxPage - 2) right = maxPage;
        for (let i = left; i <= right; i++) {
            pages.push(i);
        }
        if (right < maxPage - 2) {
            pages.push(-1);
            pages.push(maxPage);
        }

        return pages;
    }, [page]);

    return (
        <div css={paginationStyle}>
            <div css={disabledPageStyle}>
                Showing {formatNumber(startOffset)} to {formatNumber(endOffset)}{" "}
                of {formatNumber(totalCount ?? 0)} entries
            </div>
            <div css={pagesStyle}>
                <PrevPage
                    disabled={pageNumbers ? page === 1 : !hasPreviousPage}
                />
                {pageNumbers &&
                    availablePages.map((candidate: number) => (
                        <span
                            css={
                                candidate === -1
                                    ? disabledPage
                                    : candidate === page
                                    ? activePage
                                    : inactivePage
                            }
                            key={`table_pagination_${candidate}`}
                            onClick={() => candidate > 0 && setPage(candidate)}
                        >
                            {candidate === -1 ? "..." : candidate}
                        </span>
                    ))}
                <NextPage
                    disabled={pageNumbers ? page === maxPage : !hasNextPage}
                />
            </div>
        </div>
    );
}
