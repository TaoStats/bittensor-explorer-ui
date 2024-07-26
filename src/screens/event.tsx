import { useParams } from "react-router-dom";
import { useDOMEventTrigger, useEvent } from "../hooks";
import {
    Card,
    CardHeader,
    CopyToClipboardButton,
    EventInfoTable,
} from "../components";

export type EventPageParams = {
    id: string;
};

export const EventPage = () => {
    const { id } = useParams() as EventPageParams;

    const event = useEvent({ id: { equalTo: id } });

    useDOMEventTrigger("data-loaded", !event.loading);

    return event.data ? (
        <>
            <Card>
                <CardHeader>
                    Event #{id}
                    <CopyToClipboardButton value={id} />
                </CardHeader>
                <EventInfoTable event={event} />
            </Card>
        </>
    ) : (
        <></>
    );
};
