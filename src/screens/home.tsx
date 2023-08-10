/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { Card, CardRow } from "../components/Card";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import { useExtrinsicsWithoutTotalCount } from "../hooks/useExtrinsicsWithoutTotalCount";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import { useTransfers } from "../hooks/useTransfers";
import TransfersTable from "../components/transfers/TransfersTable";
import { useBlocks } from "../hooks/useBlocks";
import BlocksTable from "../components/blocks/BlocksTable";
import { NetworkStats } from "../components/network";
import { useStats } from "../hooks/useStats";
import { TokenDistributionChart } from "../components/network/TokenDistributionChart";
import { useBalances } from "../hooks/useBalances";
import BalancesTable from "../components/balances/BalancesTable";

const contentStyle = css`
  position: relative;
  flex: 1 1 auto;
  min-height: var(--content-min-height);
`;

const contentInner = css`
  box-sizing: border-box;
  max-width: 1800px;
  margin: 0 auto;
  margin-top: 64px;
  margin-bottom: 48px;
`;

const statsContainer = css`
  flex-grow: 1;
`;

const chartContainer = css`
  width: 400px;
  flex-grow: 0;
  @media only screen and (max-width: 767px) {
    flex-grow: 1;
    width: auto;
  }
`;

const infoSection = css`
  display: flex;
  @media only screen and (max-width: 767px) {
    flex-direction: column;
  }
`;

export const HomePage = () => {
	const extrinsics = useExtrinsicsWithoutTotalCount(
		undefined,
		"BLOCK_HEIGHT_DESC"
	);
	const blocks = useBlocks(undefined, "HEIGHT_DESC");
	const transfers = useTransfers(undefined, "BLOCK_NUMBER_DESC");
	const stats = useStats();
	const balances = useBalances(undefined, "BALANCE_TOTAL_DESC");

	return (
		<div css={contentStyle}>
			<div css={contentInner}>
				<CardRow css={infoSection}>
					<Card css={statsContainer}>
						<NetworkStats stats={stats} />
					</Card>
					<Card css={chartContainer}>
						{stats.data?.token && (
							<TokenDistributionChart token={stats.data?.token} />
						)}
					</Card>
				</CardRow>
				<Card>
					<TabbedContent>
						<TabPane
							label='Blocks'
							count={blocks.pagination.totalCount}
							loading={blocks.loading}
							error={blocks.error}
							value='blocks'
						>
							<BlocksTable blocks={blocks} showTime />
						</TabPane>
						<TabPane
							label='Extrinsics'
							count={extrinsics.pagination.totalCount}
							loading={extrinsics.loading}
							error={extrinsics.error}
							value='extrinsics'
						>
							<ExtrinsicsTable extrinsics={extrinsics} showAccount showTime />
						</TabPane>
						<TabPane
							label='Transfers'
							count={transfers.pagination.totalCount}
							loading={transfers.loading}
							error={transfers.error}
							value='transfers'
						>
							<TransfersTable transfers={transfers} showTime />
						</TabPane>
						<TabPane
							label='Accounts'
							count={balances.pagination.totalCount}
							loading={balances.loading}
							error={balances.error}
							value='accounts'
						>
							<BalancesTable balances={balances} />
						</TabPane>
					</TabbedContent>
				</Card>
			</div>
		</div>
	);
};
