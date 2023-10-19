import { DICTIONARY_ENDPOINT, HISTORICAL_ENDPOINT, INDEXER_ENDPOINT } from "../config";
import { fetchGraphql } from "../utils/fetchGraphql";

export async function fetchIndexer<T = any>(query: string, variables: object = {}) {
	return fetchGraphql<T>(INDEXER_ENDPOINT, query, variables);
}

export async function fetchDictionary<T = any>(query: string, variables: object = {}) {
	return fetchGraphql<T>(DICTIONARY_ENDPOINT, query, variables);
}

export async function fetchHistorical<T = any>(
	query: string,
	variables: object = {}
) {
	return fetchGraphql<T>(HISTORICAL_ENDPOINT, query, variables);
}
