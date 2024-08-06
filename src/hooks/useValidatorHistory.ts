import { useState, useEffect, useCallback } from "react";
import {
	getValidatorStakeHistory,
	getValidators,
} from "../services/validatorService";

import { useRollbar } from "@rollbar/react";
import { weightCopiers } from "../consts";
import { DataError } from "../utils/error";
import {
	ValidatorStakeHistory,
	ValidatorStakeHistoryPaginatedResponse,
	ValidatorStakeHistoryResponse,
	ValidatorsStakeHistoryResponse,
} from "../model/validator";
import { shortenHash } from "../utils/shortenHash";
import verifiedDelegates from "../delegates";

export function useValidatorStakeHistory(
	address: string
): ValidatorStakeHistoryResponse {
	const rollbar = useRollbar();

	const [data, setData] = useState<ValidatorStakeHistory[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async () => {
		try {
			let finished = false;
			let after: string | undefined = undefined;

			const result: ValidatorStakeHistory[] = [];
			while (!finished) {
				const stats: ValidatorStakeHistoryPaginatedResponse =
					await getValidatorStakeHistory([address], undefined, after);
				result.push(...stats.data);
				finished = !stats.hasNextPage;
				after = stats.endCursor;
			}
			setData(result);
		} catch (e) {
			if (e instanceof DataError) {
				rollbar.error(e);
				setError(e);
			} else {
				throw e;
			}
		}

		setLoading(false);
	}, []);

	useEffect(() => {
		setData([]);
		setError(undefined);
		setLoading(true);
		fetchData();
	}, [fetchData]);

	return {
		loading,
		error,
		data,
	};
}

export function useValidatorsStakeHistory(
	hasWeightCopiers: boolean
): ValidatorsStakeHistoryResponse {
	const rollbar = useRollbar();

	const [data, setData] = useState<
		{
			address: string;
			data: ValidatorStakeHistory[];
		}[]
	>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async () => {
		const validators = await getValidators("NOMINATOR_RETURN_PER_K_DESC", {
			limit: 20,
		});
		const valis = [];
		for (const validator of validators.data) {
			if (
				hasWeightCopiers ||
				!weightCopiers.includes(validator.address)
			) {
				valis.push(validator.address);
			}
			if (valis.length >= 12) break;
		}

		try {
			const now = Date.now();
			const from = now - 8 * 24 * 60 * 60 * 1000;

			const stats: ValidatorStakeHistoryPaginatedResponse =
				await getValidatorStakeHistory(
					valis,
					new Date(from).toISOString()
				);

			const result: {
				address: string;
				data: ValidatorStakeHistory[];
			}[] = [];
			for (const vali of valis) {
				const data = stats.data.filter((stat) => stat.address === vali);
				const current = validators.data.find(
					(it) => it.address === vali
				);
				data.push({
					timestamp: new Date(now).toISOString().substring(0, 19),
					...current,
				} as ValidatorStakeHistory);
				result.push({
					address:
						verifiedDelegates[vali]?.name ??
						shortenHash(vali) ??
						"",
					data,
				});
			}
			setData(result);
		} catch (e) {
			if (e instanceof DataError) {
				rollbar.error(e);
				setError(e);
			} else {
				throw e;
			}
		}

		setLoading(false);
	}, [hasWeightCopiers]);

	useEffect(() => {
		setData([]);
		setError(undefined);
		setLoading(true);
		fetchData();
	}, [fetchData]);

	return {
		loading,
		error,
		data,
	};
}
