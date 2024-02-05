import { Event, EventResponse } from "../model/event";
import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";
import { extractItems } from "../utils/extractItems";
import { zeroPad } from "../utils/number";
import { fetchDictionary } from "./fetchService";

export type EventsFilter = object;

export type EventsOrder = string | string[];

export async function getEvent(filter: EventsFilter) {
	const response = await fetchDictionary<{
		events: ResponseItems<EventResponse>;
	}>(
		`query ($filter: EventFilter) {
			events(first: 1, offset: 0, filter: $filter, orderBy: BLOCK_HEIGHT_DESC) {
				nodes {
					id
					blockHeight
					extrinsicId
					module
					event
					data
				}
			}
		}`,
		{
			filter,
		}
	);

	const data =
		response.events.nodes[0] && transformEvent(response.events.nodes[0]);
	return data;
}

export async function getEventsByName(
	name: string,
	order: EventsOrder = "BLOCK_HEIGHT_DESC",
	pagination: PaginationOptions
) {
	const [module, event] = name.split(".");
	const filter: EventsFilter = {
		and: [{ module: { equalTo: module } }, { event: { equalTo: event } }],
	};

	return getEvents(filter, order, pagination);
}

export async function getEvents(
	filter: EventsFilter,
	order: EventsOrder = "BLOCK_HEIGHT_DESC",
	pagination: PaginationOptions
) {
	const response = await fetchDictionary<{
		events: ResponseItems<EventResponse>;
	}>(
		`query ($first: Int!, $after: Cursor, $filter: EventFilter, $order: [EventsOrderBy!]!) {
			events(orderBy: $order, filter: $filter, first: $first, after: $after) {
				nodes {
					id
					module
					event
					blockHeight
					extrinsicId
					data
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
				}
				${pagination.after === undefined ? "totalCount" : ""}
			}
		}`,
		{
			after: pagination.after,
			first: pagination.limit,
			filter,
			order,
		}
	);

	return extractItems(response.events, pagination, transformEvent);
}

/*** PRIVATE ***/

const transformEvent = (event: EventResponse): Event => {
	const data = JSON.parse(event.data) as string[];
	const { extrinsicId } = event;
	return {
		...event,
		extrinsicId: extrinsicId === -1 ? "-1" : zeroPad(extrinsicId, 4),
		data,
	};
};
