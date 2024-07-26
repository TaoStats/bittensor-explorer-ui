/** @jsxImportSource @emotion/react */
import { useCallback } from "react";
import { Ascending, Descending, Unsorted } from "./sortIcons";
import { TableColumnButton, TableColumnButtonProps } from "./TableColumnButton";
import { SortDirection, SortOrder } from "../../model";

export type TableSortToggleProps<T> = Omit<
    TableColumnButtonProps,
    "icon" | "value" | "onChange"
> & {
    sortProperty?: T;
    startDirection?: SortDirection;
    value?: SortOrder<T>;
    onChange?: (value: SortOrder<T>) => void;
};

export const TableSortToggle = <T = any,>(props: TableSortToggleProps<T>) => {
    const {
        sortProperty,
        startDirection = SortDirection.ASC,
        value,
        onChange,
        ...buttonProps
    } = props;

    const handleClick = useCallback(() => {
        onChange?.({
            property: sortProperty,
            direction:
                value?.property !== sortProperty
                    ? startDirection
                    : value?.direction === SortDirection.ASC
                    ? SortDirection.DESC
                    : SortDirection.ASC,
        });
    }, [sortProperty, value, onChange]);

    return (
        <TableColumnButton
            icon={
                sortProperty === value?.property &&
                value?.direction === SortDirection.ASC ? (
                    <Ascending />
                ) : sortProperty === value?.property &&
                  value?.direction === SortDirection.DESC ? (
                    <Descending />
                ) : (
                    <Unsorted />
                )
            }
            color={sortProperty === value?.property ? "secondary" : undefined}
            onClick={handleClick}
            {...buttonProps}
        />
    );
};
