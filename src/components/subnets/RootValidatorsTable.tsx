/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { css } from "@emotion/react";
import { NETWORK_CONFIG } from "../../config";
import { useSubnets } from "../../hooks";
import {
    PaginatedResource,
    RootValidator,
    SortDirection,
    SortOrder,
} from "../../model";
import { RootValidatorOrder } from "../../services";
import {
    rawAmountToDecimal,
    shortenHash,
    nFormatter,
    formatNumber,
} from "../../utils";
import { ItemsTableAttribute, ItemsTable, Link } from "../elements";

const whiteText = css`
    color: #fff;
`;
const orangeText = css`
    color: #ff9900 !important;
`;
const boldText = css`
    font-weight: bold;
`;

export type RootValidatorsTableProps = {
    rootValidators: PaginatedResource<RootValidator>;
    initialSortOrder?: string;
    onSortChange?: (orderBy: RootValidatorOrder) => void;
    initialSort?: string;
};

const RootValidatorsTableAttribute = ItemsTableAttribute<RootValidator>;

const orderMappings = {
    id: {
        [SortDirection.ASC]: "ID_ASC",
        [SortDirection.DESC]: "ID_DESC",
    },
    uid: {
        [SortDirection.ASC]: "UID_ASC",
        [SortDirection.DESC]: "UID_DESC",
    },
    hotkey: {
        [SortDirection.ASC]: "HOTKEY_ASC",
        [SortDirection.DESC]: "HOTKEY_DESC",
    },
    stake: {
        [SortDirection.ASC]: "STAKE_ASC",
        [SortDirection.DESC]: "STAKE_DESC",
    },
};

export function RootValidatorsTable(props: RootValidatorsTableProps) {
    const { rootValidators } = props;

    const { initialSort, onSortChange } = props;
    const [sort, setSort] = useState<SortOrder<string>>();

    const subnets = useSubnets(undefined);

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
            data={rootValidators.data}
            loading={rootValidators.loading}
            notFound={rootValidators.notFound}
            notFoundMessage="No records."
            error={rootValidators.error}
            pagination={rootValidators.pagination}
            data-test="root-validators-table"
            sort={sort}
            onSortChange={handleSortChange}
            showRank={true}
            rankLabel="POS"
        >
            {[
                <RootValidatorsTableAttribute
                    label="uid"
                    sortable
                    render={({ uid, hotkey }) => (
                        <Link to={`/hotkey/${hotkey}`} css={boldText}>
                            {uid}
                        </Link>
                    )}
                    sortProperty="uid"
                    key="uid"
                />,
                <RootValidatorsTableAttribute
                    label={`${NETWORK_CONFIG.currency}stake`}
                    sortable
                    render={({ stake }) => (
                        <span css={orangeText}>
                            {formatNumber(
                                rawAmountToDecimal(stake.toString()),
                                {
                                    decimalPlaces: 0,
                                }
                            )}
                        </span>
                    )}
                    sortProperty="stake"
                    key="stake"
                />,
                <RootValidatorsTableAttribute
                    label="hotkey"
                    sortable
                    render={({ hotkey }) => (
                        <Link to={`/hotkey/${hotkey}`} color="white">
                            {shortenHash(hotkey, true, false)}
                        </Link>
                    )}
                    sortProperty="hotkey"
                    key="hotkey"
                />,
                ...(subnets.data ?? []).map((subnet) => (
                    <RootValidatorsTableAttribute
                        label={
                            <span>
                                SN{subnet.netUid} <br />
                                {formatNumber(
                                    rawAmountToDecimal(
                                        subnet.emission
                                    ).toNumber() * 100,
                                    {
                                        decimalPlaces: 2,
                                    }
                                )}
                                %
                            </span>
                        }
                        render={({ weights }) => {
                            const snId = subnet.netUid;
                            const wei = JSON.parse(weights);
                            let weiSum = 0;
                            Object.keys(wei).forEach((id) => {
                                weiSum += wei[id];
                            });
                            if (weiSum === 0) weiSum = 1;
                            return (
                                <span css={whiteText}>
                                    {nFormatter((wei[snId] || 0) / weiSum, 2)}
                                </span>
                            );
                        }}
                        headerCss={[orangeText, boldText]}
                        key={`SN${subnet.netUid}`}
                    />
                )),
            ]}
        </ItemsTable>
    );
}
