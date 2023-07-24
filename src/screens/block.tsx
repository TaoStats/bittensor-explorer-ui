import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { BlockInfoTable } from "../components/blocks/BlockInfoTable";
import { Card, CardHeader } from "../components/Card";
import CopyToClipboardButton from "../components/CopyToClipboardButton";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import EventsTable from "../components/events/EventsTable";
import { useBlock } from "../hooks/useBlock";
import { useEvents } from "../hooks/useEvents";
import { useExtrinsics } from "../hooks/useExtrinsics";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";

export type BlockPageParams = {
	id: string;
};

export const BlockPage = () => {
	const { id } = useParams() as BlockPageParams;

	const block = useBlock({ id: { equalTo: id } });

	const extrinsics = useExtrinsics(
		{ blockHeight: { equalTo: id } },
		"BLOCK_HEIGHT_DESC"
	);
	const events = useEvents(
		{ blockHeight: { equalTo: id } },
		"BLOCK_HEIGHT_DESC"
	);

	useDOMEventTrigger("data-loaded", !block.loading && !extrinsics.loading && !events.loading);

	useEffect(() => {
		if (extrinsics.pagination.offset === 0) {
			const interval = setInterval(extrinsics.refetch, 3000);
			return () => clearInterval(interval);
		}
	}, [extrinsics]);

	return (
		<>
			<Card>
				<CardHeader>
					Block #{id}
					<CopyToClipboardButton value={id} />
				</CardHeader>
				<BlockInfoTable block={block} />
			</Card>
			{block.data &&
				<Card>
					<TabbedContent>
						<TabPane
							label="Extrinsics"
							count={extrinsics.pagination.totalCount}
							loading={extrinsics.loading}
							error={extrinsics.error}
							value="extrinsics"
						>
							<ExtrinsicsTable extrinsics={extrinsics} showAccount />
						</TabPane>
						<TabPane
							label="Events"
							count={events.pagination.totalCount}
							loading={events.loading}
							error={events.error}
							value="events"
						>
							<EventsTable events={events} showExtrinsic />
						</TabPane>
					</TabbedContent>
				</Card>
			}
		</>
	);
};
