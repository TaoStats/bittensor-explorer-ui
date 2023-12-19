/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { Card } from "../components/Card";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import { useTransfers } from "../hooks/useTransfers";
import TransfersTable from "../components/transfers/TransfersTable";
import { useBlocks } from "../hooks/useBlocks";
import BlocksTable from "../components/blocks/BlocksTable";
import { useBalances } from "../hooks/useBalances";
import BalancesTable from "../components/balances/BalancesTable";
import { useEffect, useRef, useState } from "react";
import { BlocksOrder } from "../services/blocksService";
import { BalancesFilter, BalancesOrder } from "../services/balancesService";
import { TransfersFilter, TransfersOrder } from "../services/transfersService";
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

export const HomePage = () => {
	const blocksInitialOrder: BlocksOrder = "HEIGHT_DESC";
	const [blockSort, setBlockSort] = useState<BlocksOrder>(blocksInitialOrder);
	const blocks = useBlocks(undefined, blockSort);

	const balancesInitialOrder: BalancesOrder = "BALANCE_TOTAL_DESC";
	const [balanceSort, setBalanceSort] = useState<BalancesOrder>(
		balancesInitialOrder
	);
	const balancesInitialFilter: BalancesFilter = {
		balanceTotal: { greaterThan: 0 },
	};
	const [balanceFilter, setBalanceFilter] = useState<BalancesFilter>(
		balancesInitialFilter
	);
	const balances = useBalances(balanceFilter, balanceSort);

	const transfersInitialOrder: TransfersOrder = "BLOCK_NUMBER_DESC";
	const [transferSort, setTransferSort] = useState<TransfersOrder>(
		transfersInitialOrder
	);
	const transfersInitialFilter: TransfersFilter = {
		amount: { greaterThan: 0 },
	};
	const [transfersFilter, setTransfersFilter] = useState<TransfersFilter>(
		transfersInitialFilter
	);
	const transfers = useTransfers(transfersFilter, transferSort);

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

	const { hash: tab } = useLocation();
	const tabRef = useRef(null);
	useEffect(() => {
		if (tab) {
			document.getElementById(tab)?.scrollIntoView();
			window.scrollBy(0, -175);
		} else {
			window.scrollTo(0, 0);
		}
	}, [tab]);

	return (
		<div css={contentStyle}>
			<div css={contentInner}>
				<Card>
					<div ref={tabRef}>
						<TabbedContent defaultTab={tab.slice(1).toString()}>
							<TabPane
								label="Blocks"
								count={blocks.pagination.totalCount}
								loading={blocks.loading}
								error={blocks.error}
								value="blocks"
							>
								<BlocksTable
									blocks={blocks}
									showTime
									onSortChange={(sortKey: BlocksOrder) => setBlockSort(sortKey)}
									initialSort={blocksInitialOrder}
								/>
							</TabPane>
							<TabPane
								label="Transfers"
								count={transfers.pagination.totalCount}
								loading={transfers.loading}
								error={transfers.error}
								value="transfers"
							>
								<TransfersTable
									transfers={transfers}
									showTime
									onSortChange={(sortKey: TransfersOrder) =>
										setTransferSort(sortKey)
									}
									initialSort={transfersInitialOrder}
									onFilterChange={(newFilter?: TransfersFilter) =>
										setTransfersFilter({ ...transfersFilter, ...newFilter })
									}
									initialFilter={transfersInitialFilter}
								/>
							</TabPane>
							<TabPane
								label="Accounts"
								count={balances.pagination.totalCount}
								loading={balances.loading}
								error={balances.error}
								value="accounts"
							>
								<BalancesTable
									balances={balances}
									onSortChange={(sortKey: BalancesOrder) =>
										setBalanceSort(sortKey)
									}
									initialSort={balancesInitialOrder}
									onFilterChange={(newFilter?: BalancesFilter) =>
										setBalanceFilter({ ...balanceFilter, ...newFilter })
									}
									initialFilter={balancesInitialFilter}
								/>
							</TabPane>
						</TabbedContent>
					</div>
				</Card>
			</div>
		</div>
	);
};
