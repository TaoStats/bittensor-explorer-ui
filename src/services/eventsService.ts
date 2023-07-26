import { Event } from "../model/event";
import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";
import { extractItems } from "../utils/extractItems";
import { fetchDictionary } from "./fetchService";

export type EventsFilter = object;

export type EventsOrder = string | string[];

export async function getEvent(filter: EventsFilter) {
	const response = await fetchDictionary<{ events: ResponseItems<Event> }>(
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

	const data = response.events.nodes[0] && transformEvent(response.events.nodes[0]);
	return data;
}

export async function getEventsByName(
	name: string,
	order: EventsOrder = "BLOCK_HEIGHT_DESC",
	pagination: PaginationOptions
) {
	const filter: EventsFilter = { id: { equalTo: name } };

	return getEvents(filter, order, pagination);
}

export async function getEvents(
	filter: EventsFilter,
	order: EventsOrder = "BLOCK_HEIGHT_DESC",
	pagination: PaginationOptions
) {
	const offset = pagination.offset;

	const response = await fetchDictionary<{ events: ResponseItems<Event> }>(
		`query ($first: Int!, $offset: Int!, $filter: EventFilter, $order: [EventsOrderBy!]!) {
			events(orderBy: $order, filter: $filter, first: $first, offset: $offset) {
				nodes {
					id
					module
					event
					blockHeight
					extrinsicId
					data
				}
				totalCount
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
					startCursor
				}
			}
		}`,
		{
			first: pagination.limit,
			offset,
			filter,
			order,
		}
	);

	return extractItems(response.events, pagination, transformEvent);
}

/*** PRIVATE ***/

const transformEvent = (event: Event): Event => {
	return event;
};
