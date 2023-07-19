import Decimal from "decimal.js";
import { UsdRates } from "../model/usdRates";

export const USD_RATES_REFRESH_RATE = 60000; // 1 minute

export async function getUsdRates() {
	await window.navigator.locks.request("usd-rates", async () => {
		const usdRatesUpdatedAt = loadUsdRatesUpdatedAt();
		const coinGeckoWaitUntil = loadCoinGeckoWaitUntil();

		const nextRefreshAt = Math.max(
			usdRatesUpdatedAt + USD_RATES_REFRESH_RATE,
			coinGeckoWaitUntil
		);

		if (Date.now() < nextRefreshAt) {
			return;
		}

		try {
			const usdRates = await fetchUsdRates();
			storeUsdRates(usdRates);
			storeUsdRatesUpdatedAt(Date.now());
		} catch {
			// probably rate limit exceeded, wait 2 minutes
			storeCoinGeckoWaitUntil(Date.now() + 120000);
		}
	});

	return loadUsdRates();
}

export function getUsdRatesUpdatedAt() {
	return loadUsdRatesUpdatedAt();
}

/*** PRIVATE ***/

function loadUsdRates() {
	try {
		return JSON.parse(
			localStorage.getItem("usd-rates") || "{}",
			(key, value) => key ? new Decimal(value) : value
		) as UsdRates;
	} catch (e) {
		return {};
	}
}

function storeUsdRates(usdRates: UsdRates) {
	localStorage.setItem("usd-rates", JSON.stringify(usdRates));
}

function loadUsdRatesUpdatedAt() {
	return parseInt(localStorage.getItem("usd-rates-updated-at") || "0");
}

function storeUsdRatesUpdatedAt(time: number) {
	localStorage.setItem("usd-rates-updated-at", time.toString());
}

function loadCoinGeckoWaitUntil() {
	return parseInt(localStorage.getItem("coingecko-wait-until") || "0");
}

function storeCoinGeckoWaitUntil(time: number) {
	localStorage.setItem("coingecko-wait-until", time.toString());
}

async function fetchUsdRates() {
	// FIXME:
	const usdRates: UsdRates = {
		"TAO": new Decimal(73.31)
	};
	return usdRates;
}
