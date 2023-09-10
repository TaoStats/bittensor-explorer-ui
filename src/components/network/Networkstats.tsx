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
import { StatItem } from "./StatItem";
import { useEffect } from "react";

const stakingDataBlock = css`
  width: 100%;
  display: flex;
  align-items: center;

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
  grid-template-columns: repeat(4, 1fr);
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

	useEffect(() => {
		const id = setInterval(() => stats.refetch(), 12 * 1000);
		return () => clearInterval(id);
	}, []);

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
						title='Market Cap'
						value={`$${nFormatter(token.marketCap, 2)}`}
					/>
					<StatItem
						title='24h Volume'
						value={`$${nFormatter(token.volume24h, 2)}`}
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
						title='Active Accounts'
						value={formatNumber(new Decimal(chain.activeAccounts.toString()))}
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
