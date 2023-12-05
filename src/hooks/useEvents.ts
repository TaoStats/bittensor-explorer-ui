import { FetchOptions } from "../model/fetchOptions";
import { EventsFilter, EventsOrder, getEvents } from "../services/eventsService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useEvents(
	filter: EventsFilter,
	order?: EventsOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getEvents, [filter, order], options);
}
