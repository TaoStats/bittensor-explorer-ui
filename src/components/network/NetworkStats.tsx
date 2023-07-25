/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import Block from "../../assets/block.svg";
import Signed from "../../assets/signed.svg";
import Nominator from "../../assets/nominator.svg";
import Validator from "../../assets/validator.svg";
import Inflation from "../../assets/inflation.svg";
import StakingReward from "../../assets/staking-reward.svg";

import { Resource } from "../../model/resource";
import { Stats } from "../../model/stats";
import { getNetwork } from "../../services/networksService";

import { ErrorMessage } from "../ErrorMessage";
import Loading from "../Loading";
import NotFound from "../NotFound";

const statStyle = css`
	min-width: 100px;
	width: 100%;

	display: flex;
	align-items: center;
`;

const statIconStyle = css`
	width: 44px;
	height: 44px;
	margin-right: 10px;
	padding: 10px;
`;

const statTitleStyle = css`
	font-weight: 500;
	margin-top: auto;
`;

const statValueStyle = css`
	font-weight: 500;
	height: 32px;
`;

const statsLayoutStyle = css`
	display: grid;
	width: 100%;
	height: auto;

	gap: 10px;

	grid-template-columns: repeat(2, auto);

	@media (max-width: 530px) {
		grid-template-columns: repeat(1, auto);
	}
`;

type StatItemProps = {
	title: string;
	icon?: string;
	value?: string | number;
};

const StatItem = (props: StatItemProps) => {
	const {
		title,
		value,
		icon,
	} = props;

	return (
		<div css={statStyle}>
			<img css={statIconStyle} src={icon} />
			<div style={{display: "flex", flexDirection: "column", justifyContent: "center" }}>
				<div css={statTitleStyle}>{title}</div>
				<div css={statValueStyle}>{value}</div>
			</div>
		</div>
	);
};

export type NetworkInfoTableProps = {
	stats: Resource<Stats>;
	networkName: string;
}

export const NetworkStats = (props: NetworkInfoTableProps) => {
	const { stats, networkName } = props;

	const network = getNetwork(networkName);

	if (stats.loading) {
		return <Loading />;
	}

	if (stats.notFound) {
		return <NotFound>Stats not found.</NotFound>;
	}

	if (stats.error) {
		return (
			<ErrorMessage
				message="Unexpected error occured while fetching data"
				details={stats.error.message}
				showReported
			/>
		);
	}

	if (!stats.data || !network) {
		return null;
	}

	return (
		<div css={statsLayoutStyle}>
			<StatItem title="Finalized blocks" value={stats.data.chainFinalizedBlocks} icon={Block} />
			<StatItem title="Signed extrinsics" value={stats.data.chainSignedExtrinsics} icon={Signed} />
			<StatItem title="Staking inflation" value={`${stats.data.stakingInflationRatio.toFixed(1)}%`} icon={Inflation} />
			<StatItem title="Staking rewards" value={`${stats.data.stakingRewardsRatio.toFixed(1)}%`} icon={StakingReward} />
			<StatItem
				title="Validators"
				value={`${stats.data.stakingActiveValidatorsAmount}/${stats.data.stakingValidatorsIdealAmount}`}
				icon={Validator}
			/>
			<StatItem title="Nomination pools" value={`${stats.data.nominationPoolsPoolsActiveAmount}`} icon={Nominator} />
		</div>
	);
};
