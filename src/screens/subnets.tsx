/** @jsxImportSource @emotion/react */

import { useState } from "react";
import { Theme, css } from "@emotion/react";
import {
    Card,
    CardHeader,
    SubnetEmissionsHistoryChart,
    SubnetRegistrationChart,
    Spinner,
    SubnetsTable,
} from "../components";
import { NETWORK_CONFIG } from "../config";
import {
    useSubnets,
    useSubnetsHistory,
    useSubnetRegCostHistory,
    useSubnetStat,
    useDOMEventTrigger,
} from "../hooks";
import { SubnetsOrder } from "../services";
import { formatNumber, rawAmountToDecimal } from "../utils";

const regCostContainerStyle = () => css`
    display: flex;
    flex-direction: row;

    & > div:first-of-type {
        flex: 1;
    }
`;

const regCostValueStyle = (theme: Theme) => css`
    display: flex;
    flex-direction: column;
    width: 200px;
    gap: 10px;
    margin-left: 24px;
    padding-left: 24px;
    border-left: 1px solid rgba(255, 255, 255, 0.1);

    & > span:first-of-type {
        font-size: 13px;
        color: ${theme.palette.secondary.dark};
    }
`;

export const SubnetsPage = () => {
    const subnetsInitialOrder: SubnetsOrder = "EMISSION_DESC";
    const [subnetSort, setSubnetSort] =
        useState<SubnetsOrder>(subnetsInitialOrder);
    const subnets = useSubnets({ netUid: { notEqualTo: 0 } }, subnetSort);
    const subnetEmissionsHistory = useSubnetsHistory();
    const subnetRegCostHistory = useSubnetRegCostHistory();
    const subnetStat = useSubnetStat("subnet_stats");

    useDOMEventTrigger(
        "data-loaded",
        !subnets.loading &&
            !subnetEmissionsHistory.loading &&
            !subnetRegCostHistory.loading &&
            !subnetStat.loading
    );

    return (
        <>
            <Card data-test="subnets-history-chart">
                <SubnetEmissionsHistoryChart
                    subnetHistory={subnetEmissionsHistory}
                />
            </Card>
            <Card data-test="subnet-registration-data">
                <CardHeader>SUBNET REGISTRATION DATA</CardHeader>
                <div css={regCostContainerStyle}>
                    <SubnetRegistrationChart
                        subnetRegCostHistory={subnetRegCostHistory}
                        subnetStat={subnetStat}
                    />
                    {subnetStat.loading ? (
                        <Spinner small />
                    ) : (
                        <div css={regCostValueStyle}>
                            <span>Current Registration Cost</span>
                            <span>
                                {formatNumber(
                                    rawAmountToDecimal(
                                        subnetStat.data?.regCost?.toString()
                                    ).toNumber(),
                                    {
                                        decimalPlaces: 2,
                                    }
                                )}
                                {NETWORK_CONFIG.currency}
                            </span>
                        </div>
                    )}
                </div>
            </Card>
            <Card data-test="subnets-table">
                <SubnetsTable
                    subnets={subnets}
                    onSortChange={(sortKey: SubnetsOrder) =>
                        setSubnetSort(sortKey)
                    }
                    initialSort={subnetsInitialOrder}
                />
            </Card>
        </>
    );
};
