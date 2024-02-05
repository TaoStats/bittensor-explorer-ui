/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import Loading from "../Loading";
import NotFound from "../NotFound";
import { Theme } from "@mui/material";
import TaoIcon from "../../assets/tao_icon.png";
import { formatNumber, nFormatter, rawAmountToDecimal } from "../../utils/number";
import Decimal from "decimal.js";
import { StatItem } from "./";
import { useAppStats } from "../../contexts";
import { AccountStatChart } from "../account/AccountStatChart";
import { TabbedContent, TabPane } from "../TabbedContent";
import { useAccountStats } from "../../hooks/useAccountStats";
import { useMemo } from "react";
import { useTokenStats } from "../../hooks/useTokenStats";
import { HistoricalTokenDistributionChart } from "./HistoricalTokenDistributionChart";
import { NETWORK_CONFIG } from "../../config";

const stakingDataBlock = css`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  @media only screen and (max-width: 1399px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const priceBox = css`
  padding: 0 35px 0 0;
`;

const statItemLabel = (theme: Theme) => css`
  display: flex;
  font-size: 13px;
  color: ${theme.palette.secondary.dark};
  letter-spacing: 0.01em;
  @media only screen and (max-width: 479px) {
    font-size: 11px;
  }
`;

const bittensorBlock = css`
  padding: 8px 27px 8px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const taoIcon = css`
  margin-right: 16px;
  width: 54px;
  height: 54px;
  color: #ffffff;
  background-color: rgba(196, 196, 196, 0.06);
  border-radius: 100%;
  display: inline-block;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const stakingDataLabelContainer = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

const stakingDataPrice = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

const priceValue = (theme: Theme) => css`
  font-weight: 300;
  color: ${theme.palette.secondary.light};
  margin: 0;
  line-height: 1.3;
  font-size: 30px;
  @media only screen and (max-width: 1199px) {
    font-size: 24px;
  }
`;

const priceUp = css`
  font-size: 15px;
  font-weight: 300;
  padding-left: 8px;
  color: #7aff97;
`;

const priceDown = css`
  font-size: 15px;
  font-weight: 300;
  padding-left: 8px;
  color: #ff7a7a;
`;

const statItems = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
  @media only screen and (max-width: 1399px) {
    width: 100%;
  }
`;

const statItemsRow = css`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  width: 100%;
  @media only screen and (max-width: 1199px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media only screen and (max-width: 767px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const priceContainer = css`
  display: flex;
`;

export const NetworkStats = () => {
	const {
		state: { tokenStats, tokenLoading, chainStats, chainLoading },
	} = useAppStats();

	const accountStats = useAccountStats();
	const tokenHistoricalStats = useTokenStats();
	const totalAccount = useMemo(() => {
		const { data } = accountStats;
		if (!data || !data.length) return 0;
		return Number(data.at(-1)?.total || 0);
	}, [accountStats]);

	if (tokenLoading || chainLoading) {
		return <Loading />;
	}

	if (tokenStats === undefined || chainStats === undefined) {
		return <NotFound>Stats not found.</NotFound>;
	}

	const token = tokenStats;
	const chain = chainStats;

	return (
		<div>
			<div css={stakingDataBlock}>
				<div css={bittensorBlock}>
					<div css={priceContainer}>
						<div css={taoIcon}>
							<img src={TaoIcon} alt="Taostats Tao Icon" />
						</div>
						<div css={priceBox}>
							<div css={stakingDataLabelContainer}>
								<label css={statItemLabel}>Bittensor price</label>
							</div>
							<div css={stakingDataPrice}>
								<div css={priceValue}>${token.price}</div>
								<span
									css={
										token.priceChange24h > 0
											? priceUp
											: token.priceChange24h < 0
												? priceDown
												: ""
									}
								>
									{token.priceChange24h > 0
										? "▴"
										: token.priceChange24h < 0
											? "▾"
											: ""}
									{` ${token.priceChange24h}%`}
								</span>
							</div>
						</div>
					</div>
				</div>
				<div css={statItems}>
					<div css={statItemsRow}>
						<StatItem
							title="Market Cap"
							value={`$${nFormatter(token.marketCap, 2)}`}
						/>
						<StatItem
							title="24h Volume"
							value={`$${nFormatter(token.volume24h, 2)}`}
						/>
						<StatItem
							title="Validating APY"
							value={`${token.validationAPY}%`}
						/>
						<StatItem title="Staking APY" value={`${token.stakingAPY}%`} />
						<StatItem
							title="Staked Supply"
							value={`${formatNumber(
								new Decimal(chain.staked.toString())
									.mul(100)
									.div(new Decimal(chain.issued.toString())),
								{ decimalPlaces: 2 }
							)}%`}
						/>
					</div>

					<div css={statItemsRow}>
						<StatItem
							title="Circulating supply"
							animating={rawAmountToDecimal(chain.issued.toString()).toString()}
							suffix={NETWORK_CONFIG.currency}
						/>
						<StatItem
							title="Finalized blocks"
							animating={chain.blocksFinalized.toString()}
						/>
						<StatItem
							title="Signed extrinsics"
							animating={chain.extrinsicsSigned.toString()}
						/>
						<StatItem
							title="Total Accounts"
							value={formatNumber(totalAccount)}
						/>
						<StatItem
							title="Transfers"
							animating={chain.transfers.toString()}
						/>
					</div>
				</div>
			</div>
			<TabbedContent>
				<TabPane label="Accounts" value="accountStats">
					<AccountStatChart accountStats={accountStats} />
				</TabPane>
				<TabPane label="Issuance" value="issuance">
					<HistoricalTokenDistributionChart tokenStats={tokenHistoricalStats} />
				</TabPane>
			</TabbedContent>
		</div>
	);
};
