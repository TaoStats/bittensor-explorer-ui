/** @jsxImportSource @emotion/react */
import { useParams } from "react-router-dom";

import { Card, CardHeader } from "../components/Card";
import CopyToClipboardButton from "../components/CopyToClipboardButton";
import EventsTable from "../components/events/EventsTable";
import { ExtrinsicInfoTable } from "../components/extrinsics/ExtrinsicInfoTable";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import { useEvents } from "../hooks/useEvents";
import { useExtrinsic } from "../hooks/useExtrinsic";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";

type ExtrinsicPageParams = {
	id: string;
};

export const ExtrinsicPage = () => {
	const { id } = useParams() as ExtrinsicPageParams;
	const [blockHeight, extrinsicId] = id.split("-");

	const extrinsic = useExtrinsic({ id: { equalTo: id } });
	const events = useEvents(
		{
			and: [
				{ extrinsicId: { equalTo: parseInt(extrinsicId ?? "") } },
				{ blockHeight: { equalTo: parseInt(blockHeight ?? "") } },
			],
		},
		"BLOCK_HEIGHT_ASC"
	);

	useDOMEventTrigger("data-loaded", !extrinsic.loading && !events.loading);

	return (
		<>
			<Card>
				<CardHeader>
          Extrinsic #{id}
					<CopyToClipboardButton value={id} />
				</CardHeader>
				<ExtrinsicInfoTable extrinsic={extrinsic} />
			</Card>
			{extrinsic.data && (
				<Card>
					<TabbedContent>
						<TabPane
							label='Events'
							count={events.pagination.totalCount}
							loading={events.loading}
							error={events.error}
							value='events'
						>
							<EventsTable events={events} />
						</TabPane>
					</TabbedContent>
				</Card>
			)}
		</>
	);
};
