/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { Event } from "../../model/event";
import { PaginatedResource } from "../../model/paginatedResource";

import { getEventMetadataByName } from "../../utils/queryMetadata";

import { ButtonLink } from "../ButtonLink";
import DataViewer from "../DataViewer";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";

const parametersColCss = (showExtrinsic?: boolean) => css`
  width: ${showExtrinsic ? "40%" : "60%"};
`;

export type EventsTableProps = {
	events: PaginatedResource<Event>;
	showExtrinsic?: boolean;
};

const EventsItemsTableAttribute = ItemsTableAttribute<Event>;

function EventsTable(props: EventsTableProps) {
	const { events, showExtrinsic } = props;

	return (
		<ItemsTable
			data={events.data}
			loading={events.loading}
			notFound={events.notFound}
			notFoundMessage='No events found'
			error={events.error}
			pagination={events.pagination}
			data-test='events-table'
		>
			<EventsItemsTableAttribute
				label='ID'
				render={(event) => <Link to={`/event/${event.id}`}>{event.id}</Link>}
			/>
			<EventsItemsTableAttribute
				label='Name'
				render={(event) => (
					<ButtonLink
						to={`/search?query=${event.module}.${event.event}`}
						size='small'
						color='secondary'
					>
						{event.module}.{event.event}
					</ButtonLink>
				)}
			/>
			{showExtrinsic && (
				<EventsItemsTableAttribute
					label='Extrinsic'
					render={(event) =>
						event.extrinsicId != null && (
							<Link to={`/extrinsic/${event.blockHeight}-${event.extrinsicId}`}>
								<span>
									{`${ event.blockHeight } - ${ event.extrinsicId }`}
								</span>
							</Link>
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

export default EventsTable;
