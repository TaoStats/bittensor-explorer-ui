/** @jsxImportSource @emotion/react */
import { Theme, css } from "@emotion/react";
import Decimal from "decimal.js";

import Loading from "../components/Loading";
import NotFound from "../components/NotFound";
import { StatItem } from "../components/network/StatItem";
import { NETWORK_CONFIG } from "../config";
import { useAppStats } from "../contexts";
import { formatNumber, rawAmountToDecimal } from "../utils/number";
import StakingCalculator from "../components/StakingCalculator";
import { useValidators } from "../hooks/useValidators";
import { useMemo, useState } from "react";
import { useValidatorMovingAverage } from "../hooks/useValidatorMovingAverage";
import { weightCopiers } from "../consts";
import { Toggle } from "../components/Toggle";

const defaultText = (theme: Theme) => css`
	color: ${theme.palette.secondary.dark};
`;

const header = css`
	font-size: 19px;
	color: white;
	margin-top: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 50px;
`;

const smallLayout = css`
	max-width: 1000px;
	width: 100%;
	margin: 20px 0;
`;

const description = css`
	font-size: 14px;
	margin-top: 15px;
`;

const statItems = css`
	display: flex;
	flex-direction: column;
	gap: 8px;
	flex-grow: 1;
	max-width: 1000px;
	width: 100%;
`;

const statItemsRow = css`
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	grid-gap: 20px;
	@media only screen and (max-width: 899px) {
		grid-template-columns: repeat(4, 1fr);
	}
	@media only screen and (max-width: 779px) {
		grid-template-columns: repeat(2, 1fr);
	}
	width: 100%;
`;

const font30 = css`
	font-size: 30px !important;
`;

export const StakingPage = () => {
	const {
		state: {
			chainStats: chain,
			chainLoading: chainStatsLoading,
			tokenStats: token,
			tokenLoading: tokenStatsLoading,
		},
	} = useAppStats();
	const [includesWeightCopiers, setWeightCopiers] = useState(false);
	const validators = useValidators();
	const movingAvg = useValidatorMovingAverage(
		validators.data?.map((x) => x.address) ?? []
	);
	const sortedValis = useMemo(() => {
		if (validators.data) {
			return validators.data.filter(
				(x) =>
					(includesWeightCopiers || !weightCopiers.includes(x.address)) &&
					x.name
			);
		}
		return [];
	}, [validators, includesWeightCopiers]);

	const loading =
		chainStatsLoading ||
		tokenStatsLoading ||
		validators.loading ||
		movingAvg.loading;

	if (loading) return <Loading />;
	if (chain === undefined || token === undefined) {
		return <NotFound>Stats not found.</NotFound>;
	}

	const totalSupply = rawAmountToDecimal("21000000000000000");

	return (
		<>
			<div css={defaultText}>
				<div css={statItems}>
					<div css={statItemsRow}>
						<StatItem
							title="Staking APY"
							value={`${token.stakingAPY}%`}
							valueCSS={font30}
						/>
						<StatItem
							title="Validating APY"
							value={`${token.validationAPY}%`}
							valueCSS={font30}
						/>
						<StatItem
							title="Total Staked"
							value={`${formatNumber(
								rawAmountToDecimal(chain.staked.toString()),
								{ decimalPlaces: 0 }
							)}${NETWORK_CONFIG.currency} (${formatNumber(
								new Decimal(chain.staked.toString())
									.mul(100)
									.div(new Decimal(chain.issued.toString())),
								{ decimalPlaces: 2 }
							)}%)`}
						/>
						<StatItem
							title="Total Issuance"
							value={`${formatNumber(
								rawAmountToDecimal(chain.issued.toString()),
								{ decimalPlaces: 0 }
							)}${NETWORK_CONFIG.currency}`}
							suffix={NETWORK_CONFIG.currency}
						/>
						<StatItem
							title="Total Supply"
							value={`${formatNumber(totalSupply, { decimalPlaces: 0 })}${
								NETWORK_CONFIG.currency
							}`}
						/>
					</div>
				</div>
				<div css={header}>
					<span>STAKING CALCULATOR</span>
					<Toggle
						id="weight_copiers"
						label="Weight Copiers"
						value={includesWeightCopiers}
						onChange={setWeightCopiers}
					/>
				</div>
				<div css={smallLayout}>
					<div css={description}>
						Enter TAO quantity and price to calculate staking returns
					</div>
					<div css={description}>
						The APR above is a network average based on the total validator
						emissions for ALL validators across the network and does not take
						into account differences in validator performance, take, or subnet
						allocation. The APR does not calculate compounding as it would be a
						false metric to provide APY based on declining APR.
					</div>
					<div css={description}>
						The APR used the caluclate the returns below uses the specific take
						and 30 day Moving Average of the selected validator to give a more
						accurate result. Past performance is not a guarentee of future
						returns.
					</div>
				</div>
				<StakingCalculator
					tokenPrice={token.price}
					validators={sortedValis}
					movingAvg={movingAvg}
				/>
			</div>
		</>
	);
};
