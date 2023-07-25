/** @jsxImportSource @emotion/react */
import { HTMLAttributes } from "react";
import { css } from "@emotion/react";

import { Resource } from "../../model/resource";
import { Stats } from "../../model/stats";
import { Network } from "../../model/network";
import { formatNumber } from "../../utils/number";

import { ErrorMessage } from "../ErrorMessage";
import Loading from "../Loading";
import NotFound from "../NotFound";

import { NetworkTokenDistributionChart } from "./NetworkTokenDistributionChart";

export const valueStyle = css`
	min-width: 70px;
	display: flex;
	max-width: 230px;
	margin: 0 auto;
`;

export const valueTypeStyle = css`
	margin-bottom: 8px;
	font-weight: 500;
	flex: 1 1 auto;
`;

export const separatorStyle = css`
	display: block;
	width: 1px;
	flex: 0 0 auto;
	background-color: rgba(0, 0, 0, .125);
`;

export const notFoundStyle = css`
	margin: 0 auto;
	margin-top: 32px;
`;

export const chartStyle = css`
	margin: 0 auto;
	margin-top: 32px;
`;

export type NetworkTokenDistributionProps = HTMLAttributes<HTMLDivElement> & {
	stats: Resource<Stats>;
	network: Network;
};

export const NetworkTokenDistribution = (props: NetworkTokenDistributionProps) => {
	const {stats, network} = props;

	if (stats.loading) {
		return <Loading />;
	}

	if (stats.notFound) {
		return <NotFound css={notFoundStyle}>No stats data found</NotFound>;
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

	if (!stats.data) {
		return null;
	}

	return (
		<div>
			<div>
				<div css={valueStyle}>
					<div css={valueTypeStyle}>Total issuance</div>
					<div>{formatNumber(stats.data.balancesTotalIssuance, {compact: true})}</div>
				</div>
			</div>
			<NetworkTokenDistributionChart
				css={chartStyle}
				stats={stats.data}
				network={network}
			/>
		</div>
	);
};
