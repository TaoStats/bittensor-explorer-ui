/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { formatNumber, rawAmountToDecimal } from "../../utils/number";
import { useValidatorBalance } from "../../hooks/useValidatorBalance";
import { StatItem } from "../network/StatItem";
import { DonutChart } from "../DonutChart";
import Loading from "../Loading";
import { Resource } from "../../model/resource";
import { ValidatorResponse } from "../../model/validator";

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
	info: Resource<ValidatorResponse>;
};

export const ValidatorPortfolio = (props: ValidatorPortfolioProps) => {
	const { hotkey, info } = props;

	const balance = useValidatorBalance({ address: { equalTo: hotkey } });
	const loading = balance.loading || info.loading;
	const validatorStaked = info.data?.validatorStake.toString();
	const validatorStakedFormatted = loading ? 0 : formatNumber(rawAmountToDecimal(validatorStaked), { decimalPlaces: 2 });
	const validatorStakedPercent = loading ? 0 : ((rawAmountToDecimal(validatorStaked).toNumber() * 100) / rawAmountToDecimal(balance.data).toNumber()).toFixed(2);
	const nomineesStaked = loading ? 0 : rawAmountToDecimal(balance.data).toNumber() - rawAmountToDecimal(validatorStaked).toNumber();
	const nomineesStakedFormatted = loading ? 0 : formatNumber(nomineesStaked, { decimalPlaces: 2 });
	const nomineesStakedPercent = loading ? 0 : ((nomineesStaked * 100) / rawAmountToDecimal(balance.data).toNumber()).toFixed(2);

	return loading ? (
		<div css={spinnerContainer}>
			<Loading />
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
			<DonutChart
				options={{
					labels: [
						`Validator stake: ${validatorStakedFormatted} 𝞃 (${validatorStakedPercent}%)`,
						`Delegated stake: ${nomineesStakedFormatted} 𝞃 (${nomineesStakedPercent}%)`,
					],
				}}
				series={[
					parseFloat(rawAmountToDecimal(validatorStaked).toFixed(2)),
					parseFloat(nomineesStaked.toFixed(2)),
				]}
			/>
		</div>
	);
};
