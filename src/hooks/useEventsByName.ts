import { FetchOptions } from "../model/fetchOptions";
import { EventsOrder, getEventsByName } from "../services/eventsService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useEventsByName(
	name: string,
	order?: EventsOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getEventsByName, [name, order], options);
}
