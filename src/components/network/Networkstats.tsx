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

const stakingDataBlock = css`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
`;

const stakingDataBox = css`
  padding: 0 35px 0 0;
`;

const statItemLabel = (theme: Theme) => css`
  display: flex;
  font-size: 13px;
  color: ${theme.palette.secondary.dark};
  letter-spacing: 0.01em;
`;

const statItemValue = (theme: Theme) => css`
  font-weight: 400;
  color: ${theme.palette.secondary.light};
  margin: 0 0 6px;
  line-height: 1.3em;
`;

const bittensorBlock = css`
  width: auto;
  padding: 0 27px 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
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
  font-weight: 500;
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
  font-weight: 500;
  color: ${theme.palette.secondary.light};
  margin: 0;
  line-height: 30px;
  font-size: 30px;
`;

const priceUp = css`
  font-size: 15px;
  font-weight: 600;
  padding-left: 8px;
  color: #7AFFF7;
`;

const priceDown = css`
  font-size: 15px;
  font-weight: 600;
  padding-left: 8px;
  color: #ff7a7a;
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

	return (
		<div css={stakingDataBlock}>
			<div css={bittensorBlock}>
				<div css={taoIcon}>
					<img src={TaoIcon} alt='Taostats Tao Icon' />
				</div>
				<div css={stakingDataBox}>
					<div css={stakingDataLabelContainer}>
						<label css={statItemLabel}>Bittensor price</label>
						<div css={stakingDataLabelTag}>TAO</div>
					</div>
					<div css={stakingDataPrice}>
						<div css={priceValue}>${stats.data.price}</div>
						<span
							css={
								stats.data.priceChange24h > 0
									? priceUp
									: stats.data.priceChange24h < 0
										? priceDown
										: ""
							}
						>
							{stats.data.priceChange24h > 0
								? "▴"
								: stats.data.priceChange24h < 0
									? "▾"
									: ""}
							{` ${stats.data.priceChange24h}%`}
						</span>
					</div>
				</div>
			</div>
			<StatItem title='Market Cap' value={`$${nFormatter(stats.data.marketCap, 2)}`} />
			<StatItem
				title='Total Issuance'
				value={`${formatNumber(stats.data.currentSupply)} 𝞃`}
			/>
			<StatItem title='Total Supply' value={`${formatNumber(stats.data.totalSupply)} 𝞃`} />
			{/* <StatItem title='Next Halvening' value={`${stats.data.totalSupply} 𝞃`} /> */}
			<StatItem title='Validating APR' value={`${stats.data.validationAPY} %`} />
			<StatItem title='Staking APR' value={`${stats.data.stakingAPY} %`} />
		</div>
	);
};
