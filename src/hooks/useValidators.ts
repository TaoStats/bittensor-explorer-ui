import { useState, useCallback, useEffect } from "react";
import { getValidators } from "../services/validatorService";
import { useRollbar } from "@rollbar/react";
import { Validator } from "../model/validator";
import { DataError } from "../utils/error";

export function useValidators() {
	const rollbar = useRollbar();

	const [data, setData] = useState<Validator[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async () => {
		try {
			const validators = await getValidators({
				limit: 64,
			});
			setData(validators.data);
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
