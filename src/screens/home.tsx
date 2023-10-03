/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { Card, CardRow } from "../components/Card";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import { useTransfers } from "../hooks/useTransfers";
import TransfersTable from "../components/transfers/TransfersTable";
import DelegatesTable from "../components/delegates/DelegatesTable";
import { useBlocks } from "../hooks/useBlocks";
import BlocksTable from "../components/blocks/BlocksTable";
import { NetworkStats, TokenDistributionChart } from "../components/network";
import { useBalances } from "../hooks/useBalances";
import BalancesTable from "../components/balances/BalancesTable";
import { useEffect, useRef, useState } from "react";
import { BlocksOrder } from "../services/blocksService";
import { BalancesOrder } from "../services/balancesService";
import { TransfersOrder } from "../services/transfersService";
import { useDelegates } from "../hooks/useDelegates";
import { DelegatesOrder } from "../services/delegateService";
import { useLocation } from "react-router-dom";

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
  min-height: 400px;
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
	const { hash: tab } = useLocation();
	
	const blocksInitialOrder: BlocksOrder = "HEIGHT_DESC";
	const [blockSort, setBlockSort] = useState<BlocksOrder>(blocksInitialOrder);
	const blocks = useBlocks(undefined, blockSort);

	const balancesInitialOrder: BalancesOrder = "BALANCE_TOTAL_DESC";
	const [balanceSort, setBalanceSort] = useState<BalancesOrder>(balancesInitialOrder);
	const balances = useBalances(undefined, balanceSort);

	const transfersInitialOrder: TransfersOrder = "BLOCK_NUMBER_DESC";
	const [transferSort, setTransferSort] = useState<TransfersOrder>(transfersInitialOrder);
	const transfers = useTransfers(undefined, transferSort);

	const delegatesInitialOrder: TransfersOrder = "BLOCK_NUMBER_DESC";
	const [delegateSort, setDelegateSort] = useState<DelegatesOrder>(delegatesInitialOrder);
	const delegates = useDelegates(undefined, delegateSort);

	useEffect(() => {
		if (blocks.pagination.offset === 0) {
			const id = setInterval(
				() => blocks.refetch && blocks.refetch(),
				12 * 1000
			);
			return () => clearInterval(id);
		}
	}, [blocks]);

	useEffect(() => {
		if (transfers.pagination.offset === 0) {
			const id = setInterval(
				() => transfers.refetch && transfers.refetch(),
				12 * 1000
			);
			return () => clearInterval(id);
		}
	}, [transfers]);

	const tabRef = useRef(null);
	useEffect(() => {
		if (tab) {
			document.getElementById(tab)?.scrollIntoView();
			window.scrollBy(0, -175);
		}
	}, [tab]);

	return (
		<div css={contentStyle}>
			<div css={contentInner}>
				<CardRow css={infoSection}>
					<Card css={statsContainer}>
						<NetworkStats />
					</Card>
					<Card css={chartContainer}>
						<TokenDistributionChart />
					</Card>
				</CardRow>
				<Card>
					<div ref={tabRef}>
						<TabbedContent defaultTab={tab.slice(1).toString()}>
							<TabPane
								label='Blocks'
								count={blocks.pagination.totalCount}
								loading={blocks.loading}
								error={blocks.error}
								value='blocks'
							>
								<BlocksTable
									blocks={blocks}
									showTime
									onSortChange={(sortKey: BlocksOrder) =>
										setBlockSort(sortKey)
									}
									initialSort={blocksInitialOrder} />
							</TabPane>
							<TabPane
								label='Transfers'
								count={transfers.pagination.totalCount}
								loading={transfers.loading}
								error={transfers.error}
								value='transfers'
							>
								<TransfersTable
									transfers={transfers}
									showTime
									onSortChange={(sortKey: TransfersOrder) =>
										setTransferSort(sortKey)
									}
									initialSort={transfersInitialOrder}
								/>
							</TabPane>
							<TabPane
								label='Delegation'
								count={delegates.pagination.totalCount}
								loading={delegates.loading}
								error={delegates.error}
								value='delegation'
							>
								<DelegatesTable
									delegates={delegates}
									showTime
									onSortChange={(sortKey: DelegatesOrder) =>
										setDelegateSort(sortKey)
									}
									initialSort={delegatesInitialOrder}
								/>
							</TabPane>
							<TabPane
								label='Accounts'
								count={balances.pagination.totalCount}
								loading={balances.loading}
								error={balances.error}
								value='accounts'
							>
								<BalancesTable
									balances={balances}
									onSortChange={(sortKey: BalancesOrder) =>
										setBalanceSort(sortKey)
									}
									initialSort={balancesInitialOrder}
								/>
							</TabPane>
						</TabbedContent>
					</div>
				</Card>
			</div>
		</div>
	);
};
