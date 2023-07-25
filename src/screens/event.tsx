import { useParams } from "react-router-dom";

import { Card, CardHeader } from "../components/Card";
import CopyToClipboardButton from "../components/CopyToClipboardButton";
import { EventInfoTable } from "../components/events/EventInfoTable";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { useEvent } from "../hooks/useEvent";

export type EventPageParams = {
	id: string;
};

export const EventPage = () => {
	const { id } = useParams() as EventPageParams;

	const event = useEvent({ id: { equalTo: id } });

	useDOMEventTrigger("data-loaded", !event.loading);

	return (
		event.data ? 
			<>
				<Card>
					<CardHeader>
						Event #{id}
						<CopyToClipboardButton value={id} />
					</CardHeader>
					<EventInfoTable event={event} />
				</Card>
			</>: <></>
	);
};
