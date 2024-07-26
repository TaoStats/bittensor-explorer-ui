import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
    Card,
    CardHeader,
    CopyToClipboardButton,
    BlockInfoTable,
    TabbedContent,
    TabPane,
    ExtrinsicsTable,
    EventsTable,
} from "../components";
import {
    useBlock,
    useExtrinsics,
    useEvents,
    useDOMEventTrigger,
} from "../hooks";

export type BlockPageParams = {
    id: string;
};

export const BlockPage = () => {
    const { id } = useParams() as BlockPageParams;

    const block = useBlock({ id: { equalTo: id } });

    const extrinsics = useExtrinsics(
        { blockHeight: { equalTo: id } },
        "ID_ASC"
    );
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
                            <ExtrinsicsTable
                                extrinsics={extrinsics}
                                showAccount
                            />
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
