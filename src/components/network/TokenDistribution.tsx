/** @jsxImportSource @emotion/react */
import { HTMLAttributes } from "react";
import { css } from "@emotion/react";
import { formatNumber } from "../../utils/number";
import { TokenDistributionChart } from "./TokenDistributionChart";
import { Resource } from "../../model/resource";
import { Stats } from "../../model/stats";
import Loading from "../Loading";
import { ErrorMessage } from "../ErrorMessage";
import NotFound from "../NotFound";

export const valueStyle = css`
  min-width: 70px;
  display: flex;
  max-width: 230px;
  margin: 0 auto;
`;

export const valueTypeStyle = css`
  margin-bottom: 8px;
  font-weight: 700;
  flex: 1 1 auto;
`;

export const separatorStyle = css`
  display: block;
  width: 1px;
  flex: 0 0 auto;
  background-color: rgba(0, 0, 0, 0.125);
`;

export const notFoundStyle = css`
  margin: 0 auto;
  margin-top: 32px;
`;

export const chartStyle = css`
  margin: 0 auto;
  margin-top: 32px;
`;

export type TokenDistributionProps = HTMLAttributes<HTMLDivElement> & {
	stats: Resource<Stats>;
};

export const TokenDistribution = (props: TokenDistributionProps) => {
	const { stats } = props;
	if (stats.loading) {
		return <Loading />;
	}

	if (stats.notFound) {
		return <NotFound css={notFoundStyle}>No stats data found</NotFound>;
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
		<div>
			<div>
				<div css={valueStyle}>
					<div css={valueTypeStyle}>Total issuance</div>
					<div>
						{formatNumber(stats.data.token.totalSupply, {
							compact: true,
						})}
					</div>
				</div>
			</div>
			<TokenDistributionChart css={chartStyle} token={stats.data.token} />
		</div>
	);
};
