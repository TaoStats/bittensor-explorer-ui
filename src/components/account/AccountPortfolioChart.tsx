/** @jsxImportSource @emotion/react */
import { HTMLAttributes } from "react";
import { css } from "@emotion/react";

import { rawAmountToDecimal } from "../../utils/number";

import { AccountBalance } from "../../model/balance";
import Decimal from "decimal.js";
import { DonutChart } from "../DonutChart";

const chartContainer = css``;

export type AccountPortfolioChartProps = HTMLAttributes<HTMLDivElement> & {
	balance: AccountBalance | undefined;
	taoPrice: Decimal | undefined;
};

export const AccountPortfolioChart = (props: AccountPortfolioChartProps) => {
	const { balance } = props;

	const total = rawAmountToDecimal(balance?.total.toString());
	const free = rawAmountToDecimal(balance?.free.toString());
	const staked = rawAmountToDecimal(balance?.staked.toString());

	return total.isZero() ? (
		<></>
	) : (
		<div css={chartContainer}>
			<DonutChart
				options={{
					labels: ["Staked", "Free"],
					legend: {
						horizontalAlign: "center",
						position: "bottom",
					},
				}}
				series={[parseFloat(staked.toFixed(2)), parseFloat(free.toFixed(2))]}
			/>
		</div>
	);
};
