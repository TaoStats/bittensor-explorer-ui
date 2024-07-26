/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { isHex } from "@polkadot/util";
import {
    Card,
    CardHeader,
    CopyToClipboardButton,
    ExtrinsicInfoTable,
    TabbedContent,
    TabPane,
    EventsTable,
} from "../components";
import { useExtrinsic, useEvents, useDOMEventTrigger } from "../hooks";

type ExtrinsicPageParams = {
    query: string;
};

export const ExtrinsicPage = () => {
    const { query } = useParams() as ExtrinsicPageParams;

    const maybeHash = isHex(query);

    const [blockHeight, setBlockHeight] = useState<string | undefined>();
    const [extrinsicId, setExtrinsicId] = useState<string | undefined>();

    const extrinsicByHash = useExtrinsic(
        { txHash: { equalTo: query } },
        { skip: !maybeHash }
    );
    const extrinsicById = useExtrinsic(
        { id: { equalTo: query } },
        { skip: maybeHash }
    );

    useEffect(() => {
        const extrinsic = maybeHash ? extrinsicByHash : extrinsicById;
        if (
            !extrinsic.error &&
            !extrinsic.loading &&
            !extrinsic.notFound &&
            extrinsic.data
        ) {
            const id = extrinsic.data.id;
            const [newBlockHeight, newExtrinsicId] = id.split("-");
            setBlockHeight(newBlockHeight);
            setExtrinsicId(newExtrinsicId);
        }
    }, [extrinsicByHash, extrinsicById]);

    const events = useEvents(
        {
            and: [
                { extrinsicId: { equalTo: parseInt(extrinsicId ?? "") } },
                { blockHeight: { equalTo: parseInt(blockHeight ?? "") } },
            ],
        },
        "NATURAL",
        { skip: !blockHeight || !extrinsicId }
    );

    const allResources = [extrinsicByHash, extrinsicById, events];
    useDOMEventTrigger(
        "data-loaded",
        allResources.every((it) => !it.loading)
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

    const extrinsic = maybeHash ? extrinsicByHash : extrinsicById;

    return (
        <>
            <Card>
                <CardHeader>
                    Extrinsic #{blockHeight}-{extrinsicId}
                    <CopyToClipboardButton
                        value={blockHeight + "-" + extrinsicId}
                    />
                </CardHeader>
                <ExtrinsicInfoTable extrinsic={extrinsic} />
            </Card>
            {extrinsic.data && (
                <Card>
                    <TabbedContent>
                        <TabPane
                            label="Events"
                            count={events.pagination.totalCount}
                            loading={events.loading}
                            error={events.error}
                            value="events"
                        >
                            <EventsTable events={events} />
                        </TabPane>
                    </TabbedContent>
                </Card>
            )}
        </>
    );
};
