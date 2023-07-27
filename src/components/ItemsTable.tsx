/** @jsxImportSource @emotion/react */
import {
  Children,
  cloneElement,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { css, Interpolation, Theme } from '@emotion/react';

import { Pagination } from '../hooks/usePagination';
import { SortDirection } from '../model/sortDirection';
import { SortOrder } from '../model/sortOrder';

import { ErrorMessage } from './ErrorMessage';
import Loading from './Loading';
import NotFound from './NotFound';
import { TablePagination } from './TablePagination';
import { TableSortOptions, TableSortOptionsProps } from './TableSortOptions';
import { TableSortToggle } from './TableSortToggle';

const tableStyle = css`
  table-layout: fixed;
  min-width: 860px;

  & > thead > tr > th,
  & > tbody > tr > td {
    border: none !important;
  }

  & > tbody > tr {
    background-color: #1a1a1a;
  }

  & > tbody > tr:nth-of-type(odd) {
    background-color: rgba(18, 18, 18, 0.86);
    -webkit-box-shadow: inset 0 0 8px 0 rgba(255, 255, 255, 0.05);
    -moz-box-shadow: inset 0 0 8px 0 rgba(255, 255, 255, 0.05);
    box-shadow: inset 0 0 8px 0 rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  & > thead > tr > th:first-of-type,
  & > tbody > tr > td:first-of-type {
    padding-left: 20px;
  }

  & > thead > tr > th:last-child,
  & > tbody > tr > td:last-child {
    padding-right: 20px;
  }
`;

const cellStyle = (theme: Theme) => css`
  word-break: break-all;
  border: none;
  color: ${theme.palette.secondary.dark};

  &:first-of-type {
    padding-left: 0;
  }

  &:last-of-type {
    padding-right: 0;
  }
`;

type ItemsTableItem = {
  id: string;
};

type ItemsTableDataFn<T, A extends any[], R> = (
  data: T,
  ...additionalData: A
) => R;

export type ItemsTableAttributeProps<T, A extends any[], S> = {
  label: ReactNode;
  colCss?: Interpolation<Theme>;
  sortable?: boolean;
  sortProperty?: S;
  startDirection?: SortDirection;
  sortOptions?: TableSortOptionsProps<S>['options'];
  onSortChange?: (sortOrder: SortOrder<S>) => void;
  render: ItemsTableDataFn<T, A, ReactNode>;
  colSpan?: ItemsTableDataFn<T, A, number>;
  hide?: ItemsTableDataFn<T, A, boolean>;
  _data?: T;
  _additionalData?: A;
};

export const ItemsTableAttribute = <
  T extends object = any,
  S = any,
  A extends any[] = []
>(
  props: ItemsTableAttributeProps<T, A, S>
) => {
  const { colSpan, render, hide, _data, _additionalData = [] as any } = props;

  if (!_data || hide?.(_data, ..._additionalData)) {
    return null;
  }

  return (
    <TableCell css={cellStyle} colSpan={colSpan?.(_data, ..._additionalData)}>
      {render(_data, ..._additionalData)}
    </TableCell>
  );
};

export type ItemsTableProps<
  T extends ItemsTableItem,
  S = any,
  A extends any[] = []
> = HTMLAttributes<HTMLDivElement> & {
  data?: T[];
  additionalData?: A;
  loading?: boolean;
  notFound?: boolean;
  notFoundMessage?: string;
  error?: any;
  errorMessage?: string;
  sort?: SortOrder<any>;
  pagination?: Pagination;
  children:
    | ReactElement<ItemsTableAttributeProps<T, A, S>>
    | (
        | ReactElement<ItemsTableAttributeProps<T, A, S>>
        | false
        | undefined
        | null
      )[];
};

export const ItemsTable = <
  T extends ItemsTableItem,
  S = any,
  A extends any[] = []
>(
  props: ItemsTableProps<T, S, A>
) => {
  const {
    data,
    additionalData,
    loading,
    notFound,
    notFoundMessage = 'No items found',
    error,
    errorMessage = 'Unexpected error occured while fetching items',
    sort,
    pagination,
    children,
    ...restProps
  } = props;

  if (loading) {
    return <Loading />;
  }

  if (notFound) {
    return <NotFound>{notFoundMessage}</NotFound>;
  }

  if (error) {
    return (
      <ErrorMessage
        message={errorMessage}
        details={error.message}
        showReported
      />
    );
  }

  return (
    <div {...restProps} data-class='table'>
      <TableContainer>
        <Table css={tableStyle}>
          <colgroup>
            {Children.map(
              children,
              (child) => child && <col css={child.props.colCss} />
            )}
          </colgroup>
          <TableHead>
            <TableRow>
              {Children.map(
                children,
                (child) =>
                  child && (
                    <TableCell css={cellStyle}>
                      {child.props.label}
                      {child.props.sortable && (
                        <>
                          {child.props.sortOptions && (
                            <TableSortOptions
                              options={child.props.sortOptions}
                              value={sort}
                              onChange={child.props.onSortChange}
                            />
                          )}
                          {!child.props.sortOptions && (
                            <TableSortToggle
                              sortProperty={child.props.sortProperty}
                              startDirection={child.props.startDirection}
                              value={sort}
                              onChange={child.props.onSortChange}
                            />
                          )}
                        </>
                      )}
                    </TableCell>
                  )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((item) => (
              <TableRow key={item.id}>
                {Children.map(
                  children,
                  (child) =>
                    child &&
                    cloneElement(child, {
                      _data: item,
                      _additionalData: additionalData,
                    })
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && <TablePagination {...pagination} />}
    </div>
  );
};
