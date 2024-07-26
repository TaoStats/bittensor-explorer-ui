/** @jsxImportSource @emotion/react */
import { HTMLAttributes } from "react";
import { css } from "@emotion/react";
import Decimal from "decimal.js";
import { AccountBalance } from "../../model";
import { rawAmountToDecimal, formatCurrency } from "../../utils";
import { DonutChart } from "../elements";

const chartContainer = css``;

export type AccountPortfolioChartProps = HTMLAttributes<HTMLDivElement> & {
    balance: AccountBalance | undefined;
    taoPrice: Decimal | undefined;
};

export const AccountPortfolioChart = (props: AccountPortfolioChartProps) => {
    const { balance } = props;

    const free = rawAmountToDecimal(balance?.free.toString());
    const delegated = rawAmountToDecimal(balance?.staked.toString());
    const total = rawAmountToDecimal(balance?.total.toString());

    const strFree = formatCurrency(free, "USD", { decimalPlaces: 2 });
    const strDelegated = formatCurrency(delegated, "USD", { decimalPlaces: 2 });

    return total.isZero() ? (
        <></>
    ) : (
        <div css={chartContainer}>
            <DonutChart
                options={{
                    labels: [
                        `Delegated: ${strDelegated} 𝞃 (${delegated
                            .div(total)
                            .mul(100)
                            .toFixed(2)}%)`,
                        `Free: ${strFree} 𝞃 (${free
                            .div(total)
                            .mul(100)
                            .toFixed(2)}%)`,
                    ],
                }}
                series={[
                    parseFloat(delegated.toFixed(2)),
                    parseFloat(free.toFixed(2)),
                ]}
            />
        </div>
    );
};
