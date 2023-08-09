/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { Resource } from "../../model/resource";
import { Stats } from "../../model/stats";

import { ErrorMessage } from "../ErrorMessage";
import Loading from "../Loading";
import NotFound from "../NotFound";
import { Theme } from "@mui/material";
import TaoIcon from "../../assets/tao_icon.png";
import { formatNumber, nFormatter } from "../../utils/number";
import Decimal from "decimal.js";

const stakingDataBlock = css`
  width: 100%;
  display: flex;
  align-items: center;

  @media only screen and (max-width: 1279px) {
    padding-right: 0;
  }
`;

const stakingDataBox = css`
  padding: 0;
  flex: 1 1 0;

  @media only screen and (max-width: 1279px) {
    padding: 0 26px 0 0;
  }
  @media only screen and (max-width: 799px) {
    width: 33%;
    padding: 0;
    padding-bottom: 5px;
  }
  @media only screen and (max-width: 479px) {
    width: 50%;
    padding: 0;
    padding-bottom: 5px;
  }
  :last-child {
    padding-right: 0;
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

const statItemValue = (theme: Theme) => css`
  font-weight: 300;
  color: ${theme.palette.secondary.light};
  margin: 0;
  line-height: 1.3em;

  @media only screen and (max-width: 1279px) {
    font-size: 15px;
  }
  @media only screen and (max-width: 767px) {
    font-size: 14px;
  }
  @media only screen and (max-width: 639px) {
    font-size: 13px;
    letter-spacing: 0.02em;
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

const stakingDataLabelTag = (theme: Theme) => css`
  display: inline-block;
  vertical-align: middle;
  font-size: 12px;
  font-weight: 300;
  line-height: 1em;
  text-transform: uppercase;
  background-color: #292929;
  padding: 5px;
  border-radius: 4px;
  color: ${theme.palette.secondary.light};
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
`;

const statItemsRow = css`
  display: flex;
  width: 100%;
`;

const priceContainer = css`
  display: flex;
`;

const marketInfo = css`
  display: flex;
  width: 100%;
  margin-left: 8px;
`;

type StatItemProps = {
	title: string;
	value: string | number;
};

const StatItem = (props: StatItemProps) => {
	const { title, value } = props;

	return (
		<div css={stakingDataBox}>
			<label css={statItemLabel}>{title}</label>
			<div css={statItemValue}>{value}</div>
		</div>
	);
};

export type NetworkInfoTableProps = {
	stats: Resource<Stats>;
};

export const NetworkStats = (props: NetworkInfoTableProps) => {
	const { stats } = props;

	if (stats.loading) {
		return <Loading />;
	}

	if (stats.notFound) {
		return <NotFound>Stats not found.</NotFound>;
	}

	if (stats.error) {
		return (
			<ErrorMessage
				message='Unexpected error occured while fetching data'
				details={stats.error.message}
				showReported
			/>
		);
	}

	if (!stats.data) {
		return null;
	}

	const { token, chain } = stats.data;

	return (
		<div css={stakingDataBlock}>
			<div css={bittensorBlock}>
				<div css={priceContainer}>
					<div css={taoIcon}>
						<img src={TaoIcon} alt='Taostats Tao Icon' />
					</div>
					<div css={priceBox}>
						<div css={stakingDataLabelContainer}>
							<label css={statItemLabel}>Bittensor price</label>
							<div css={stakingDataLabelTag}>TAO</div>
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
				<div css={marketInfo}>
					<StatItem
						title='Market Cap'
						value={`$${nFormatter(token.marketCap, 2)}`}
					/>
					<StatItem
						title='24h Volume'
						value={`$${nFormatter(token.volume24h, 2)}`}
					/>
				</div>
			</div>
			<div css={statItems}>
				<div css={statItemsRow}>
					<StatItem
						title='Total Issuance'
						value={`${formatNumber(token.currentSupply)} 𝞃`}
					/>
					<StatItem
						title='Total Supply'
						value={`${formatNumber(token.totalSupply)} 𝞃`}
					/>
					{/* <StatItem title='Next Halvening' value={`${stats.data.totalSupply} 𝞃`} /> */}
					<StatItem title='Validating APY' value={`${token.validationAPY}%`} />
					<StatItem title='Staking APY' value={`${token.stakingAPY}%`} />
				</div>

				<div css={statItemsRow}>
					<StatItem
						title='Finalized blocks'
						value={formatNumber(new Decimal(chain.blocksFinalized.toString()))}
					/>
					<StatItem
						title='Signed extrinsics'
						value={formatNumber(new Decimal(chain.extrinsicsSigned.toString()))}
					/>
					<StatItem
						title='Accounts'
						value={formatNumber(new Decimal(chain.accounts.toString()))}
					/>
					<StatItem
						title='Transfers'
						value={formatNumber(new Decimal(chain.transfers.toString()))}
					/>
				</div>
			</div>
		</div>
	);
};
