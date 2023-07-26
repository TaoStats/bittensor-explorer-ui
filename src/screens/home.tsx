/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { Card } from "../components/Card";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import { useExtrinsicsWithoutTotalCount } from "../hooks/useExtrinsicsWithoutTotalCount";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import { useTransfers } from "../hooks/useTransfers";
import TransfersTable from "../components/transfers/TransfersTable";
import { hasSupport } from "../services/networksService";
import { useBlocks } from "../hooks/useBlocks";
import BlocksTable from "../components/blocks/BlocksTable";
import { useBalances } from "../hooks/useBalances";
import BalancesTable from "../components/balances/BalancesTable";
import { useUsdRates } from "../hooks/useUsdRates";
import { useRootLoaderData } from "../hooks/useRootLoaderData";

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

export const HomePage = () => {
	const { network } = useRootLoaderData();

	const extrinsics = useExtrinsicsWithoutTotalCount(
		network.name,
		undefined,
		"id_DESC"
	);
	const blocks = useBlocks(network.name, undefined, "id_DESC");
	const transfers = useTransfers(network.name, undefined, "id_DESC");
	const topHolders = useBalances(network.name, undefined, "total_DESC");

	const usdRates = useUsdRates();

	return (
		<div css={contentStyle}>
			<div css={contentInner}>
				<Card>
					<TabbedContent>
						<TabPane
							label="Extrinsics"
							count={extrinsics.pagination.totalCount}
							loading={extrinsics.loading}
							error={extrinsics.error}
							value="extrinsics"
						>
							<ExtrinsicsTable
								network={network.name}
								extrinsics={extrinsics}
								showAccount
								showTime
							/>
						</TabPane>
						<TabPane
							label="Blocks"
							count={blocks.pagination.totalCount}
							loading={blocks.loading}
							error={blocks.error}
							value="blocks"
						>
							<BlocksTable
								network={network.name}
								blocks={blocks}
								showValidator
								showTime
							/>
						</TabPane>

						{hasSupport(network.name, "main-squid") && (
							<TabPane
								label="Transfers"
								count={transfers.pagination.totalCount}
								loading={transfers.loading}
								error={transfers.error}
								value="transfers"
							>
								<TransfersTable
									network={network.name}
									transfers={transfers}
									showTime
								/>
							</TabPane>
						)}
						{hasSupport(network.name, "balances-squid") && (
							<TabPane
								label="Top holders"
								count={topHolders.pagination.totalCount}
								loading={topHolders.loading}
								error={topHolders.error}
								value="top-holders"
							>
								<BalancesTable
									network={network.name}
									balances={topHolders}
									usdRates={usdRates}
								/>
							</TabPane>
						)}
					</TabbedContent>
				</Card>
			</div>
			
		</div>
	);
};
