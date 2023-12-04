import { useLocation, useParams } from "react-router-dom";

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
import { useRef, useEffect } from "react";

export type BlockPageParams = {
	id: string;
};

export const BlockPage = () => {
	const { id } = useParams() as BlockPageParams;

	const block = useBlock({ id: { equalTo: id } });

	const extrinsics = useExtrinsics({ blockHeight: { equalTo: id } }, "ID_ASC");
	const events = useEvents(
		{ blockHeight: { equalTo: id } },
		"EXTRINSIC_ID_ASC"
	);

	useDOMEventTrigger(
		"data-loaded",
		!block.loading && !extrinsics.loading && !events.loading
	);

	const { hash: tab } = useLocation();
	useEffect(() => {
		if (tab) {
			document.getElementById(tab)?.scrollIntoView();
			window.scrollBy(0, -175);
		} else {
			window.scrollTo(0, 0);
		}
	}, [tab]);

	return (
		<>
			<Card>
				<CardHeader>
          Block #{id}
					<CopyToClipboardButton value={id} />
				</CardHeader>
				<BlockInfoTable block={block} />
			</Card>
			{block.data && (
				<Card>
					<TabbedContent defaultTab={tab.slice(1).toString()}>
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
			)}
		</>
	);
};
