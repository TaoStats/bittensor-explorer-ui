/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import {
    MinerColdKey,
    PaginatedResource,
    SortDirection,
    SortOrder,
} from "../../model";
import { MinerColdkeyOrder } from "../../services";
import { ItemsTable, ItemsTableAttribute, Link } from "../elements";

const whiteText = css`
    color: white;
`;

export type MinerColdkeyTableProps = {
    minerColdkeys: PaginatedResource<MinerColdKey>;
    initialSortOrder?: string;
    onSortChange?: (orderBy: MinerColdkeyOrder) => void;
    initialSort?: string;
};

const MinerColdkeyTableAttribute = ItemsTableAttribute<MinerColdKey>;

const orderMappings = {
    coldkey: {
        [SortDirection.ASC]: "COLDKEY_ASC",
        [SortDirection.DESC]: "COLDKEY_DESC",
    },
    minersCount: {
        [SortDirection.ASC]: "MINERS_COUNT_ASC",
        [SortDirection.DESC]: "MINERS_COUNT_DESC",
    },
};

export function MinerColdkeyTable(props: MinerColdkeyTableProps) {
    const { minerColdkeys, initialSort, onSortChange } = props;
    const [sort, setSort] = useState<SortOrder<string>>();

    useEffect(() => {
        Object.entries(orderMappings).forEach(([property, value]) => {
            Object.entries(value).forEach(([dir, orderKey]) => {
                if (orderKey === initialSort) {
                    setSort({
                        property,
                        direction:
                            dir === "1"
                                ? SortDirection.ASC
                                : SortDirection.DESC,
                    });
                }
            });
        });
    }, [initialSort]);

    const handleSortChange = (property?: string) => {
        if (!property) return;
        if (property === sort?.property) {
            setSort({
                ...sort,
                direction:
                    sort.direction === SortDirection.ASC
                        ? SortDirection.DESC
                        : SortDirection.ASC,
            });
        } else {
            setSort({
                property,
                direction: SortDirection.DESC,
            });
        }
    };

    useEffect(() => {
        if (!onSortChange || !sort?.property || sort.direction === undefined)
            return;
        onSortChange((orderMappings as any)[sort.property][sort.direction]);
    }, [JSON.stringify(sort)]);

    return (
        <ItemsTable
            data={minerColdkeys.data}
            loading={minerColdkeys.loading}
            notFound={minerColdkeys.notFound}
            notFoundMessage="No miner coldkey found"
            error={minerColdkeys.error}
            pagination={minerColdkeys.pagination}
            data-test="miner-ip-table"
            sort={sort}
            onSortChange={handleSortChange}
        >
            <MinerColdkeyTableAttribute
                label="Coldkey"
                sortable
                render={({ coldkey }) => (
                    <Link to={`/coldkey/${coldkey}`} color="white">
                        {coldkey}
                    </Link>
                )}
                sortProperty="coldkey"
            />
            <MinerColdkeyTableAttribute
                label="UIDs"
                sortable
                render={({ minersCount }) => (
                    <span css={whiteText}> {minersCount} </span>
                )}
                sortProperty="minersCount"
            />
        </ItemsTable>
    );
}
