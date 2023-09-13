/** @jsxImportSource @emotion/react */
import { HTMLAttributes } from "react";
import { css } from "@emotion/react";
import LoadingSpinner from "../../assets/loading.gif";
import { StatItem } from "./StatItem";
import { formatNumber, nFormatter } from "../../utils/number";
import { useTotalIssuance } from "../../hooks/useTotalIssuance";
import { useDelegatedSupply } from "../../hooks/useDelegatedSupply";
import { useAppStats } from "../../contexts";
import { DonutChart } from "../DonutChart";

const chartContainer = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const supplyInfo = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  @media only screen and (max-width: 767px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const spinnerContainer = css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export type TokenDistributionChartProps = HTMLAttributes<HTMLDivElement>;

export const TokenDistributionChart = () => {
	const { state: { tokenLoading, tokenStats } } = useAppStats();
	const token = tokenStats;
	const totalIssuance = useTotalIssuance();
	const delegated = useDelegatedSupply();

	const loading =
    tokenLoading ||
    token === undefined ||
    totalIssuance === undefined ||
    delegated === undefined;

	const delegatedPercent = loading
		? 0
		: ((token.delegatedSupply / totalIssuance.toNumber()) * 100).toFixed(2);
	const circulatingPercent = loading
		? 0
		: (100 - (token.delegatedSupply / totalIssuance.toNumber()) * 100).toFixed(
			2
		);
	const totalIssuanceFormatted = loading
		? ""
		: nFormatter(totalIssuance.toNumber(), 2);

	return loading ? (
		<div css={spinnerContainer}>
			<img src={LoadingSpinner} />
		</div>
	) : (
		<div css={chartContainer}>
			<div css={supplyInfo}>
				<StatItem
					title='Total Supply'
					value={`${formatNumber(token.totalSupply)} 𝞃`}
				/>
				<StatItem
					title='Circulating Supply'
					value={`${formatNumber(totalIssuance, { decimalPlaces: 2 })} 𝞃`}
				/>
			</div>
			<DonutChart
				options={{
					labels: [
						`Circulating Delegated/Staked (${delegatedPercent}% of ${totalIssuanceFormatted})`,
						`Circulating Free (${circulatingPercent}% of ${totalIssuanceFormatted})`,
						`Unissued (${(
							100 -
							(totalIssuance.toNumber() / token.totalSupply) * 100
						).toFixed(2)}% of ${nFormatter(token.totalSupply, 2)})`,
					],
				}}
				series={[
					token.delegatedSupply,
					totalIssuance.toNumber() - token.delegatedSupply,
					token.totalSupply - totalIssuance.toNumber(),
				]}
			/>
		</div>
	);
};
