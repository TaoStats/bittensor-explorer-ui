import { Event } from "../model/event";
import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";

import { addRuntimeSpec } from "../utils/addRuntimeSpec";
import { extractItems } from "../utils/extractItems";

import { fetchDictionary } from "./fetchService";
import { getBlock } from "./blocksService";

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
				}
			}
		}`,
		{
			filter,
		}
	);

	const data = response.events.nodes[0] && transformEvent(response.events.nodes[0]);
	if (!data) return;

	const blockResponse = await getBlock({ height: { equalTo: data.blockHeight } });
	if (!blockResponse) return;
	const newData = { ...data, specVersion: blockResponse.specVersion, timestamp: blockResponse.timestamp };

	const event = addRuntimeSpec(newData, it => it.specVersion);

	return event;
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
