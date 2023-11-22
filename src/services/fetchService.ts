import { DICTIONARY_ENDPOINT, INDEXER_ENDPOINT } from "../config";
import { fetchGraphql } from "../utils/fetchGraphql";

export async function fetchIndexer<T = any>(query: string, variables: object = {}) {
	return fetchGraphql<T>(INDEXER_ENDPOINT, query, variables);
}

export async function fetchDictionary<T = any>(query: string, variables: object = {}) {
	return fetchGraphql<T>(DICTIONARY_ENDPOINT, query, variables);
}
