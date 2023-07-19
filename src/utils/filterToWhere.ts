export const filterToWhere = (filter: any = {}): string => {
	let where = "";

	if (Array.isArray(filter)) {
		return `[
			${filter.map(filterToWhere).join(", ")}
		]`;
	} else if (filter instanceof Object) {
		where += `{
			${
	Object.keys(filter).map(
		(key) => `${key}: ${filterToWhere(filter[key])}`
	)
}},`;
	} else if (filter !== "") {
		const isString = typeof filter === "string";
		const value = isString ? `"${filter}"` : filter;
		where += value;
	}

	return where;
};
