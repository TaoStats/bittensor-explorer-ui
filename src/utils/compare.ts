import Decimal from "decimal.js";

import { SortDirection } from "../model/sortDirection";

export enum UndefinedOrder {
	ALWAYS_FIRST,
	ALWAYS_LAST,
	DIRECTION_FIRST,
	DIRECTION_LAST,
}

export function compare<A, B>(a?: A, b?: B, direction = SortDirection.ASC, undefinedOrder = UndefinedOrder.ALWAYS_LAST): number {
	if (a === undefined || b === undefined) {
		return compareWithUndefined(a, b, direction, undefinedOrder);
	} else if (a instanceof Decimal && b instanceof Decimal) {
		return compareDecimals(a, b, direction);
	} else if (typeof a === "string" && typeof b === "string") {
		return compareStrings(a, b, direction);
	} else if (Array.isArray(a) || Array.isArray(b)) {
		return compareArrays(a, b, direction, undefinedOrder);
	}

	if ((a as any) < (b as any)) {
		return -1 * direction;
	} else if ((a as any) > (b as any)) {
		return 1 * direction;
	} else {
		return 0;
	}
}

export function compareProps<T>(a: T, b: T, propGetter?: (obj: T) => any, direction = SortDirection.ASC, undefinedOrder = UndefinedOrder.ALWAYS_LAST) {
	const aProp = propGetter?.(a);
	const bProp = propGetter?.(b);

	return compare(aProp, bProp, direction, undefinedOrder);
}

function compareDecimals(a: Decimal, b: Decimal, direction = SortDirection.ASC) {
	return a.comparedTo(b) * direction;
}

function compareStrings(a: string, b: string, direction = SortDirection.ASC) {
	return a.localeCompare(b) * direction;
}

function compareArrays<A, B>(a: A | A[], b: B | B[], direction = SortDirection.ASC, undefinedOrder = UndefinedOrder.ALWAYS_LAST) {
	a = Array.isArray(a) ? a : [a];
	b = Array.isArray(b) ? b : [b];

	for (let i = 0; i < Math.max(a.length, b.length); ++i) {
		const result = compare(a[i], b[i], direction, undefinedOrder);
		if (result) {
			return result;
		}
	}

	return 0;
}

function compareWithUndefined<A, B>(a?: A, b?: B, direction = SortDirection.ASC, undefinedOrder = UndefinedOrder.ALWAYS_LAST) {
	const result = a === b ? 0
		: typeof a === "undefined" ? -1 : 1;

	switch (undefinedOrder) {
		case UndefinedOrder.ALWAYS_FIRST: return result;
		case UndefinedOrder.ALWAYS_LAST: return result * -1;
		case UndefinedOrder.DIRECTION_FIRST: return result * direction;
		case UndefinedOrder.DIRECTION_LAST: return result * direction * -1;
	}
}
