import { rollbar } from "../rollbar";

export function assert(value: any, condition: any) {
	if (!condition) {
		console.warn("Assert failed", { value });
		rollbar.warning("Assert failed", { value });
	}
}
