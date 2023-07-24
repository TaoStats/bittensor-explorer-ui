import { ArchiveEvent } from "../model/archive/archiveEvent";
import { Event } from "../model/event";
import { ResponseItems } from "../model/itemsConnection";
import { ItemsResponse } from "../model/itemsResponse";
import { PaginationOptions } from "../model/paginationOptions";
import { addRuntimeSpec, addRuntimeSpecs } from "../utils/addRuntimeSpec";
import { upperFirst } from "../utils/string";
import { extractItems } from "../utils/extractItems";

import { getRuntimeSpec } from "./runtimeService";
import { fetchDictionary } from "./fetchService";

export type EventsFilter =
	{ id_eq: string; }
	| { blockId_eq: string; }
	| { callId_eq: string; }
	| { extrinsicId_eq: string; }
	| { palletName_eq: string; }
	| { palletName_eq: string, eventName_eq: string; };

export type EventsOrder = string | string[];

export async function getEvent(filter: EventsFilter) {
	const response = await fetchDictionary<{ events: ArchiveEvent[] }>(
		`query ($filter: EventWhereInput) {
			events(limit: 1, offset: 0, where: $filter, orderBy: id_DESC) {
				id
				name
				block {
					id
					height
					timestamp
					spec {
						specVersion
					}
				}
				extrinsic {
					id
				}
				call {
					id
				}
				args
			}
		}`,
		{
			filter: eventsFilterToArchiveFilter(filter),
		}
	);

	const data = response.events[0] && unifyArchiveEvent(response.events[0]);
	const event = addRuntimeSpec(data, it => it.specVersion);

	return event;
}

export async function getEventsByName(
	name: string,
	order: EventsOrder = "id_DESC",
	pagination: PaginationOptions
): Promise<ItemsResponse<Event>> {
	let [palletName = "", eventName = ""] = name.split(".");

	const runtimeSpec = await getRuntimeSpec("latest");

	// try to fix casing according to latest runtime spec
	const runtimePallet = runtimeSpec.metadata.pallets.find(it => it.name.toLowerCase() === palletName?.toLowerCase());
	const runtimeEvent = runtimePallet?.events.find(it => it.name.toLowerCase() === eventName?.toLowerCase());

	// use found names from runtime metadata or try to fix the first letter casing as fallback
	palletName = runtimePallet?.name.toString() || upperFirst(palletName);
	eventName = runtimeEvent?.name.toString() || upperFirst(eventName);

	const filter: EventsFilter = eventName
		? { palletName_eq: palletName, eventName_eq: eventName }
		: { palletName_eq: palletName };


	// const counterFilter = eventName
	// 	? `Events.${palletName}.${eventName}`
	// 	: `Events.${palletName}`;

	// // this call is divided on purpose, otherwise it would timeout when there are no events found.
	// const countResponse = await fetchExplorerSquid<{ itemsCounterById: ItemsCounter | null }>(
	// 	`query ($counterFilter: String!) {
	// 		itemsCounterById(id: $counterFilter) {
	// 			total
	// 		}
	// 	}`,
	// 	{
	// 		counterFilter,
	// 	}
	// );

	// if (countResponse.itemsCounterById === null || countResponse.itemsCounterById.total === 0) {
	// 	return {
	// 		data: [],
	// 		pagination: {
	// 			...pagination,
	// 			hasNextPage: false
	// 		}
	// 	};
	// }

	// const events = await getExplorerSquidEvents(filter, order, pagination, false);
	// events.pagination.totalCount = countResponse.itemsCounterById.total;

	// return events;

	return getEvents(filter, order, pagination);
}

export async function getEvents(
	filter: EventsFilter,
	order: EventsOrder = "id_DESC",
	pagination: PaginationOptions,
	fetchTotalCount = true
) {
	const after = pagination.offset === 0 ? null : pagination.offset.toString();

	const response = await fetchDictionary<{ eventsConnection: ResponseItems<ArchiveEvent> }>(
		`query ($first: Int!, $after: String, $filter: EventWhereInput, $order: [EventOrderByInput!]!) {
			eventsConnection(orderBy: $order, where: $filter, first: $first, after: $after) {
				edges {
					node {
						id
						name
						block {
							id
							height
							timestamp
							spec {
								specVersion
							}
						}
						extrinsic {
							id
						}
						call {
							id
						}
						args
					}
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
					startCursor
				}
				${fetchTotalCount ? "totalCount" : ""}
			}
		}`,
		{
			first: pagination.limit,
			after,
			filter: eventsFilterToArchiveFilter(filter),
			order,
		}
	);

	const items = extractItems(response.eventsConnection, pagination, unifyArchiveEvent);
	const events = await addRuntimeSpecs(items, it => it.specVersion);

	return events;
}

/*** PRIVATE ***/

function unifyArchiveEvent(event: ArchiveEvent): Omit<Event, "runtimeSpec"> {
	const [palletName, eventName] = event.name.split(".") as [string, string];

	return {
		...event,
		blockId: event.block.id,
		blockHeight: event.block.height,
		timestamp: event.block.timestamp,
		palletName,
		eventName,
		extrinsicId: event.extrinsic?.id || null,
		callId: event.call?.id || null,
		args: null,
		specVersion: event.block.spec.specVersion,
	};
}

function eventsFilterToArchiveFilter(filter?: EventsFilter) {
	if (!filter) {
		return undefined;
	}

	if ("blockId_eq" in filter) {
		return {
			block: {
				id_eq: filter.blockId_eq
			}
		};
	} else if ("callId_eq" in filter) {
		return {
			call: {
				id_eq: filter.callId_eq
			}
		};
	} else if ("extrinsicId_eq" in filter) {
		return {
			extrinsic: {
				id_eq: filter.extrinsicId_eq
			}
		};
	} else if ("palletName_eq" in filter) {
		return {
			name_eq: ("eventName_eq" in filter)
				? `${filter.palletName_eq}.${filter.eventName_eq}`
				: filter.palletName_eq
		};
	}

	return filter;
}
