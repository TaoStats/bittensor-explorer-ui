import { ArchiveEvent } from "../model/archive/archiveEvent";
import { ExplorerSquidEvent } from "../model/explorer-squid/explorerSquidEvent";
import { Event } from "../model/event";
import { ItemsConnection } from "../model/itemsConnection";
import { ItemsResponse } from "../model/itemsResponse";
import { PaginationOptions } from "../model/paginationOptions";
import { addRuntimeSpec, addRuntimeSpecs } from "../utils/addRuntimeSpec";
import { upperFirst } from "../utils/string";
import { extractConnectionItems } from "../utils/extractConnectionItems";

import { fetchArchive, fetchExplorerSquid } from "./fetchService";
import { getRuntimeSpec } from "./runtimeService";

export type EventsFilter =
	{ id_eq: string; }
	| { blockId_eq: string; }
	| { callId_eq: string; }
	| { extrinsicId_eq: string; }
	| { palletName_eq: string; }
	| { palletName_eq: string, eventName_eq: string; };

export type EventsOrder = string | string[];

export async function getEvent(filter: EventsFilter) {
	// return getExplorerSquidEvent(filter);
	return getArchiveEvent(filter);
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

	return getArchiveEvents(filter, order, pagination, false);
}

export async function getEvents(
	filter: EventsFilter,
	order: EventsOrder = "id_DESC",
	pagination: PaginationOptions
) {
	// return getExplorerSquidEvents(filter, order, pagination);
	return getArchiveEvents(filter, order, pagination);
}

/*** PRIVATE ***/

async function getArchiveEvent(filter: EventsFilter) {
	const response = await fetchArchive<{ events: ArchiveEvent[] }>(
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

async function getExplorerSquidEvent(filter: EventsFilter) {
	const response = await fetchExplorerSquid<{ events: ExplorerSquidEvent[] }>(
		`query ($filter: EventWhereInput) {
			events(limit: 1, offset: 0, where: $filter, orderBy: id_DESC) {
				id
				eventName
				palletName
				block {
					id
					height
					timestamp
					specVersion
				}
				extrinsic {
					id
				}
				call {
					id
				}
			}
		}`,
		{
			filter: eventsFilterToExplorerSquidFilter(filter),
		}
	);

	const data = response.events[0] && unifyExplorerSquidEvent(response.events[0]);
	const dataWithRuntimeSpec = await addRuntimeSpec(data, it => it.specVersion);
	const event = await addEventArgs(dataWithRuntimeSpec);

	return event;
}

async function getArchiveEvents(
	filter: EventsFilter,
	order: EventsOrder = "id_DESC",
	pagination: PaginationOptions,
	fetchTotalCount = true
) {
	const after = pagination.offset === 0 ? null : pagination.offset.toString();

	const response = await fetchArchive<{ eventsConnection: ItemsConnection<ArchiveEvent> }>(
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

	const items = extractConnectionItems(response.eventsConnection, pagination, unifyArchiveEvent);
	const events = await addRuntimeSpecs(items, it => it.specVersion);

	return events;
}

async function getExplorerSquidEvents(
	filter: EventsFilter,
	order: EventsOrder = "id_DESC",
	pagination: PaginationOptions,
	fetchTotalCount = true
) {
	const after = pagination.offset === 0 ? null : pagination.offset.toString();

	const response = await fetchExplorerSquid<{ eventsConnection: ItemsConnection<ExplorerSquidEvent> }>(
		`query ($first: Int!, $after: String, $filter: EventWhereInput, $order: [EventOrderByInput!]!) {
			eventsConnection(orderBy: $order, where: $filter, first: $first, after: $after) {
				edges {
					node {
						id
						eventName
						palletName
						block {
							id
							height
							timestamp
							specVersion
						}
						extrinsic {
							id
						}
						call {
							id
						}
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
			filter: eventsFilterToExplorerSquidFilter(filter),
			order,
		}
	);

	const data = extractConnectionItems(response.eventsConnection, pagination, unifyExplorerSquidEvent);
	const dataWithRuntimeSpecs = await addRuntimeSpecs(data, it => it.specVersion);
	const events = await addEventsArgs(dataWithRuntimeSpecs);

	return events;
}

async function getArchiveEventArgs(eventIds: string[]) {
	const response = await fetchArchive<{ events: { id: string, args: any }[] }>(
		`
			query($ids: [String!]) {
				events(where: { id_in: $ids }) {
					id
					args
				}
			}
		`,
		{
			ids: eventIds,
		}
	);

	return response.events.reduce((argsByEventId, event) => {
		argsByEventId[event.id] = event.args;
		return argsByEventId;
	}, {} as Record<string, any>);
}

async function addEventArgs(event: Event | undefined) {
	if (!event) {
		return undefined;
	}

	const argsByEventId = await getArchiveEventArgs([event.id]);

	return {
		...event,
		args: argsByEventId[event.id]
	};
}

async function addEventsArgs(items: ItemsResponse<Event>) {
	const eventIds = items.data.map((event) => event.id);

	const argsByEventId = await getArchiveEventArgs(eventIds);

	return {
		...items,
		data: items.data.map(event => ({
			...event,
			args: argsByEventId[event.id]
		}))
	};
}

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

function unifyExplorerSquidEvent(event: ExplorerSquidEvent): Omit<Event, "runtimeSpec"> {
	return {
		...event,
		blockId: event.block.id,
		blockHeight: event.block.height,
		timestamp: event.block.timestamp,
		extrinsicId: event.extrinsic?.id || null,
		callId: event.call?.id || null,
		args: null,
		specVersion: event.block.specVersion,
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

function eventsFilterToExplorerSquidFilter(filter?: EventsFilter) {
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
	}

	return filter;
}
