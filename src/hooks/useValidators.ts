import { ValidatorsOrder, getValidators } from "../services/validatorService";
import { usePaginatedResource } from "./usePaginatedResource";

export function useValidators(order?: ValidatorsOrder) {
	return usePaginatedResource(getValidators, [order]);
}
