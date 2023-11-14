import {
	Validator,
	ValidatorStakeHistory,
	ValidatorStakeHistoryPaginatedResponse,
} from "../model/validator";
import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";

import { extractItems } from "../utils/extractItems";

import { fetchHistorical, fetchIndexer } from "./fetchService";
import { isAddress } from "@polkadot/util-crypto";
import { DataError } from "../utils/error";
import { fetchVerifiedDelegates } from "./delegateService";
import { DelegateInfo } from "../model/delegate";

export type ValidatorsFilter = object;

export async function getValidators(
	pagination: PaginationOptions
) {
	const response = await fetchIndexer<{
		validators: ResponseItems<Validator>;
	}>(
		`query($first: Int!) {
			validators(first: $first, orderBy: RANK_ASC) {
				nodes {
					id
					height
					timestamp
					address
					amount
					nominators
					rank
					amountChange
					nominatorChange
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
				}
				totalCount
			  }
		}`,
		{
			first: pagination.limit,
		}
	);

	const verifiedDelegates = await fetchVerifiedDelegates();
	return extractItems(
		response.validators,
		pagination,
		addValidatorName,
		verifiedDelegates
	);
}

function addValidatorName<T extends { address: string; name?: string }>(
	validator: T,
	verifiedDelegates: Record<string, DelegateInfo>
): T {
	const info = (verifiedDelegates as Record<string, DelegateInfo>)[
		validator.address
	];
	if (info === undefined) return validator;
	return { ...validator, name: info.name } as T;
}

export async function getValidatorStakeHistory(
	address: string,
	after?: string,
	limit = 100
): Promise<ValidatorStakeHistoryPaginatedResponse> {
	if (!isAddress(address)) {
		throw new DataError("Invalid account address");
	}

	const response = await fetchHistorical<{
		validators: ResponseItems<ValidatorStakeHistory>;
	}>(
		`query($after: Cursor, $first: Int!) {
			validators(after: $after, first: $first, filter: {address: {equalTo: "${address}"}}, orderBy: HEIGHT_ASC) {
				nodes {
					amount
					nominators
					rank
					timestamp
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			  }
		}`,
		{
			first: limit,
			after,
		}
	);

	return {
		hasNextPage: response.validators?.pageInfo.hasNextPage,
		endCursor: response.validators?.pageInfo.endCursor,
		data: response.validators?.nodes,
	};
}
