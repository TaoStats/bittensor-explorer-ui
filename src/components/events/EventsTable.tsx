/** @jsxImportSource @emotion/react */

import { Event, PaginatedResource } from "../../model";
import { ButtonLink, ItemsTable, ItemsTableAttribute, Link } from "../elements";

export type EventsTableProps = {
    events: PaginatedResource<Event>;
    showExtrinsic?: boolean;
};

const EventsItemsTableAttribute = ItemsTableAttribute<Event>;

export function EventsTable(props: EventsTableProps) {
    const { events, showExtrinsic } = props;

    return (
        <ItemsTable
            data={events.data}
            loading={events.loading}
            notFound={events.notFound}
            notFoundMessage="No events found"
            error={events.error}
            pagination={events.pagination}
            data-test="events-table"
        >
            <EventsItemsTableAttribute
                label="ID"
                render={(event) => (
                    <Link to={`/event/${event.id}`}>{event.id}</Link>
                )}
            />
            <EventsItemsTableAttribute
                label="Name"
                render={(event) => (
                    <ButtonLink
                        to={`/search?query=${event.module}.${event.event}`}
                        size="small"
                        color="secondary"
                    >
                        {event.module}.{event.event}
                    </ButtonLink>
                )}
            />
            {showExtrinsic && (
                <EventsItemsTableAttribute
                    label="Extrinsic"
                    render={(event) =>
                        event.extrinsicId != "-1" ? (
                            <Link
                                to={`/extrinsic/${event.blockHeight}-${event.extrinsicId}`}
                            >
                                <span>{`${event.blockHeight}-${event.extrinsicId}`}</span>
                            </Link>
                        ) : (
                            "System Event"
                        )
                    }
                />
            )}
            {/* <EventsItemsTableAttribute
				label="Parameters"
				colCss={parametersColCss(showExtrinsic)}
				render={(event) => {
					if (!event.data) {
						return null;
					}

					return (
						<DataViewer
							data={event.data}
							metadata={getEventMetadataByName(
								event.runtimeSpec.metadata,
								event.module,
								event.event
							)?.args}
							runtimeSpec={event.runtimeSpec}
							copyToClipboard
						/>
					);
				}}
			/> */}
        </ItemsTable>
    );
}
