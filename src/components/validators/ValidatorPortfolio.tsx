/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import LoadingSpinner from "../../assets/loading.gif";
import Chart from "react-apexcharts";
import { formatNumber, rawAmountToDecimal } from "../../utils/number";
import { useColdKey } from "../../hooks/useColdKey";
import { useValidatorStaked } from "../../hooks/useValidatorStaked";
import { useValidatorBalance } from "../../hooks/useValidatorBalance";
import { StatItem } from "../network/StatItem";

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

export type ValidatorPortfolioProps = {
	hotkey: string;
};

export const ValidatorPortfolio = (props: ValidatorPortfolioProps) => {
	const { hotkey } = props;

	const balance = useValidatorBalance({ delegate: { equalTo: hotkey } });
	const coldKey = useColdKey(hotkey);
	const validatorStaked = useValidatorStaked(hotkey, coldKey);
	const loading = balance.loading || validatorStaked === undefined;
	const validatorStakedFormatted = loading
		? 0
		: formatNumber(rawAmountToDecimal(validatorStaked), { decimalPlaces: 2 });
	const validatorStakedPercent = loading
		? 0
		: (
			(rawAmountToDecimal(validatorStaked).toNumber() * 100) /
        rawAmountToDecimal(balance.data).toNumber()
		).toFixed(2);
	const nomineesStaked = loading
		? 0
		: rawAmountToDecimal(balance.data).toNumber() -
      rawAmountToDecimal(validatorStaked).toNumber();
	const nomineesStakedFormatted = loading
		? 0
		: formatNumber(nomineesStaked, { decimalPlaces: 2 });
	const nomineesStakedPercent = loading
		? 0
		: (
			(nomineesStaked * 100) /
        rawAmountToDecimal(balance.data).toNumber()
		).toFixed(2);

	const theme = useTheme();

	return loading ? (
		<div css={spinnerContainer}>
			<img src={LoadingSpinner} />
		</div>
	) : (
		<div css={chartContainer}>
			<div css={supplyInfo}>
				<StatItem
					title="Validator stake"
					value={`${validatorStakedFormatted} 𝞃`}
				/>
				<StatItem
					title="Delegated stake"
					value={`${nomineesStakedFormatted} 𝞃`}
				/>
			</div>
			<Chart
				options={{
					labels: [
						`Validator stake: ${validatorStakedFormatted} 𝞃 (${validatorStakedPercent}%)`,
						`Delegated stake: ${nomineesStakedFormatted} 𝞃 (${nomineesStakedPercent}%)`,
					],
					colors: [theme.palette.success.main, theme.palette.neutral.main],
					dataLabels: {
						enabled: false,
					},
					stroke: {
						show: true,
						curve: "smooth",
						lineCap: "butt",
						colors: [theme.palette.primary.dark],
						width: 6,
						dashArray: 0,
					},
					responsive: [
						{
							breakpoint: 767,
							options: {
								chart: {
									height: 320,
								},
								stroke: {
									width: 4,
								},
							},
						},
						{
							breakpoint: 599,
							options: {
								chart: {
									height: 270,
								},
								stroke: {
									width: 2,
								},
							},
						},
					],
					legend: {
						show: true,
						position: "bottom",
						horizontalAlign: "center",
						floating: false,
						fontSize: "13px",
						labels: {
							colors: undefined,
							useSeriesColors: true,
						},
					},
				}}
				series={[
					parseFloat(rawAmountToDecimal(validatorStaked).toFixed(2)),
					parseFloat(nomineesStaked.toFixed(2)),
				]}
				type="donut"
				height={400}
			/>
		</div>
	);
};
