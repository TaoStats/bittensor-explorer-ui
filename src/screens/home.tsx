/** @jsxImportSource @emotion/react */
import { css, Theme } from "@emotion/react";

import { Card } from "../components/Card";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import { useExtrinsicsWithoutTotalCount } from "../hooks/useExtrinsicsWithoutTotalCount";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import { useTransfers } from "../hooks/useTransfers";
import TransfersTable from "../components/transfers/TransfersTable";
import { useBlocks } from "../hooks/useBlocks";
import BlocksTable from "../components/blocks/BlocksTable";

const contentStyle = css`
  position: relative;
  flex: 1 1 auto;
  min-height: var(--content-min-height);
`;

const contentInner = css`
  box-sizing: border-box;
  max-width: 1500px;
  margin: 0 auto;
  margin-top: 64px;
  margin-bottom: 48px;
  padding: 0 16px;
`;

const subtitleStyle = (theme: Theme) => css`
  position: relative;
  margin: 0;
  margin-bottom: 4rem;
  text-align: center;
  color: ${theme.palette.text.primary};
`;

export const HomePage = () => {
	// const extrinsics = useExtrinsicsWithoutTotalCount(
	// 	undefined,
	// 	"id_DESC"
	// );
	const blocks = useBlocks(undefined, "HEIGHT_DESC");
	const transfers = useTransfers(undefined, "BLOCK_NUMBER_DESC");

	return (
		<div css={contentStyle}>
			<div css={contentInner}>
				<h1 css={subtitleStyle}>Block explorer for Bittensor ecosystem</h1>
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
						{/* <TabPane
							label="Extrinsics"
							count={extrinsics.pagination.totalCount}
							loading={extrinsics.loading}
							error={extrinsics.error}
							value="extrinsics"
						>
							<ExtrinsicsTable
								extrinsics={extrinsics}
								showAccount
								showTime
							/>
						</TabPane> */}
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
							/>
						</TabPane>
					</TabbedContent>
				</Card>
			</div>
		</div>
	);
};
