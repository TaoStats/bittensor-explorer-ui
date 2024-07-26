/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { weightCopiers } from "../../consts";
import { NETWORK_CONFIG } from "../../config";
import {
    PaginatedResource,
    SortDirection,
    SortOrder,
    Validator,
} from "../../model";
import { ValidatorsOrder } from "../../services";
import {
    rawAmountToDecimalBy,
    formatCurrency,
    rawAmountToDecimal,
    formatNumber,
} from "../../utils";
import {
    ItemsTableAttribute,
    ItemsTable,
    AccountAddress,
    Currency,
    Link,
} from "../elements";
import { Tooltip } from "@mui/material";

export type ValidatorsTableProps = {
    validators: PaginatedResource<Validator>;
    initialSort?: string;
    onSortChange?: (orderBy: ValidatorsOrder) => void;
};

const day_change_css = css`
    font-size: small;
    font-weight: bold;
    margin-left: 10px;
`;

const ValidatorsTableAttribute = ItemsTableAttribute<Validator>;

const orderMappings = {
    amount: {
        [SortDirection.ASC]: "AMOUNT_ASC",
        [SortDirection.DESC]: "AMOUNT_DESC",
    },
    amountChange: {
        [SortDirection.ASC]: "AMOUNT_CHANGE_ASC",
        [SortDirection.DESC]: "AMOUNT_CHANGE_DESC",
    },
    validatorStake: {
        [SortDirection.ASC]: "VALIDATOR_STAKE_ASC",
        [SortDirection.DESC]: "VALIDATOR_STAKE_DESC",
    },
    nominators: {
        [SortDirection.ASC]: "NOMINATORS_ASC",
        [SortDirection.DESC]: "NOMINATORS_DESC",
    },
    nominatorChange: {
        [SortDirection.ASC]: "NOMINATOR_CHANGE_ASC",
        [SortDirection.DESC]: "NOMINATOR_CHANGE_DESC",
    },
    totalDailyReturn: {
        [SortDirection.ASC]: "TOTAL_DAILY_RETURN_ASC",
        [SortDirection.DESC]: "TOTAL_DAILY_RETURN_DESC",
    },
    nominatorReturnPerK: {
        [SortDirection.ASC]: "NOMINATOR_RETURN_PER_K_ASC",
        [SortDirection.DESC]: "NOMINATOR_RETURN_PER_K_DESC",
    },
    validatorReturn: {
        [SortDirection.ASC]: "VALIDATOR_RETURN_ASC",
        [SortDirection.DESC]: "VALIDATOR_RETURN_DESC",
    },
    take: {
        [SortDirection.ASC]: "TAKE_ASC",
        [SortDirection.DESC]: "TAKE_DESC",
    },
};

export function ValidatorsTable(props: ValidatorsTableProps) {
    const { validators, initialSort, onSortChange } = props;

    const { currency, prefix } = NETWORK_CONFIG;

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
            data={validators.data}
            loading={validators.loading}
            notFoundMessage="No validators found"
            error={validators.error}
            data-test="validators-table"
            sort={sort}
            onSortChange={handleSortChange}
            showRank
        >
            <ValidatorsTableAttribute
                label="Validator"
                render={(validator) =>
                    validator.name === undefined ? (
                        <AccountAddress
                            address={validator.address}
                            prefix={prefix}
                            shorten
                            delegate
                            copyToClipboard="small"
                        />
                    ) : (
                        <Link to={`/validator/${validator.address}`}>
                            {validator.name}
                        </Link>
                    )
                }
            />

            <ValidatorsTableAttribute
                label="Total Stake"
                align="right"
                render={(validator) => {
                    return (
                        <Currency
                            amount={validator.amount}
                            currency={currency}
                            decimalPlaces={0}
                            showFullInTooltip
                        />
                    );
                }}
                sortable
                sortProperty="amount"
            />
            <ValidatorsTableAttribute
                label="24h"
                align="right"
                render={(validator) => {
                    const change24h = validator.amountChange;
                    return (
                        <>
                            {change24h != BigInt("0") && (
                                <span
                                    css={day_change_css}
                                    className={`${
                                        change24h > 0 ? "success" : "warning"
                                    }`}
                                >
                                    {change24h > 0 ? (
                                        <>&#9652;</>
                                    ) : (
                                        <>&#9662;</>
                                    )}
                                    <Currency
                                        amount={
                                            change24h > 0
                                                ? change24h
                                                : -change24h
                                        }
                                        currency={currency}
                                        decimalPlaces={0}
                                        showFullInTooltip
                                    />
                                </span>
                            )}
                        </>
                    );
                }}
                sortable
                sortProperty="amountChange"
            />

            <ValidatorsTableAttribute
                label="Nominators"
                align="right"
                render={(validator) => {
                    return <>{validator.nominators}</>;
                }}
                sortable
                sortProperty="nominators"
            />
            <ValidatorsTableAttribute
                label="24h"
                align="right"
                render={(validator) => {
                    const change24h = validator.nominatorChange;
                    return (
                        <>
                            {change24h != BigInt("0") && (
                                <span
                                    css={day_change_css}
                                    className={`${
                                        change24h > 0 ? "success" : "warning"
                                    }`}
                                >
                                    {change24h > 0 ? (
                                        <>&#9652;</>
                                    ) : (
                                        <>&#9662;</>
                                    )}
                                    <>
                                        {(change24h > 0
                                            ? change24h
                                            : -change24h
                                        ).toString()}
                                    </>
                                </span>
                            )}
                        </>
                    );
                }}
                sortable
                sortProperty="nominatorChange"
            />
            <ValidatorsTableAttribute
                label="Take"
                align="right"
                render={(validator) =>
                    `${formatNumber(
                        rawAmountToDecimalBy(validator.take ?? 0, 65535).mul(
                            100
                        ),
                        { decimalPlaces: 2 }
                    )} %`
                }
                sortable
                sortProperty="take"
            />
            <ValidatorsTableAttribute
                label="NOM. / 24h / k𝞃"
                align="right"
                render={({ nominatorReturnPerK, address }) => {
                    return weightCopiers.includes(address) ? (
                        <>
                            <Tooltip
                                arrow
                                placement="top"
                                title="Copying Weights"
                            >
                                <span className="warning">
                                    {formatCurrency(
                                        rawAmountToDecimal(
                                            nominatorReturnPerK.toString()
                                        ),
                                        currency,
                                        {
                                            decimalPlaces: 3,
                                        }
                                    )}
                                </span>
                            </Tooltip>
                        </>
                    ) : (
                        <Currency
                            amount={nominatorReturnPerK}
                            currency={currency}
                            decimalPlaces={3}
                            showFullInTooltip
                        />
                    );
                }}
                sortable
                sortProperty="nominatorReturnPerK"
            />

            <ValidatorsTableAttribute
                label="VAL. / 24h"
                align="right"
                render={(validator) => {
                    return (
                        <Currency
                            amount={validator.validatorReturn}
                            currency={currency}
                            decimalPlaces={3}
                            showFullInTooltip
                        />
                    );
                }}
                sortable
                sortProperty="validatorReturn"
            />
        </ItemsTable>
    );
}
