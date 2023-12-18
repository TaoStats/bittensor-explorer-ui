import { useState, useEffect, useCallback } from "react";
import { getValidatorStakeHistory } from "../services/validatorService";

import { useRollbar } from "@rollbar/react";
import { DataError } from "../utils/error";
import {
	ValidatorStakeHistory,
	ValidatorStakeHistoryPaginatedResponse,
	ValidatorStakeHistoryResponse,
} from "../model/validator";

export function useValidatorStakeHistory(
	address: string
): ValidatorStakeHistoryResponse {
	const rollbar = useRollbar();

	const [data, setData] = useState<ValidatorStakeHistory[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async () => {
		try {
			const limit = 100;

			let finished = false;
			let after: string | undefined = undefined;

			const result: ValidatorStakeHistory[] = [];
			while (!finished) {
				const stats: ValidatorStakeHistoryPaginatedResponse =
          await getValidatorStakeHistory(address, after, limit);
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
