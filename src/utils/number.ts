import Decimal from "decimal.js";
import { NETWORK_CONFIG } from "../config";

const supportedFiatCurrencies = ["USD"];

export function rawAmountToDecimal(amount: string | undefined) {
	const { decimals } = NETWORK_CONFIG;
	const scale = new Decimal(10).pow(decimals * -1);
	return new Decimal(amount || 0).mul(scale);
}

export type FormatNumberOptions = {
	decimalPlaces?: number;
	compact?: boolean;
}

export function formatNumber(value: number | Decimal, options: FormatNumberOptions = {}) {
	if (!(value instanceof Decimal)) {
		value = new Decimal(value);
	}

	return Intl.NumberFormat("en-US", {
		maximumFractionDigits: options.compact ? 3 : (options.decimalPlaces || 20),
		notation: options.compact ? "compact" : undefined
	}).format(value.toString() as any);
}

export type FormatCurrencyOptions = {
	decimalPlaces?: "optimal" | number;
	minimalUsdValue?: Decimal;
	usdRate?: Decimal;
	compact?: boolean;
}

export function formatCurrency(value: number | Decimal, currency: string, options: FormatCurrencyOptions = {}) {
	if (!(value instanceof Decimal)) {
		value = new Decimal(value);
	}

	let decimalPlaces = options.decimalPlaces || 20;

	if (decimalPlaces === "optimal") {
		decimalPlaces =
			options.usdRate ? getOptimalDecimalPlaces(options.usdRate, options.minimalUsdValue)
				: currency.toUpperCase() === "USD" ? 2 // default for USD
					: 4; // default for crypto
	}

	// Intl formats fiat currencies using proper symbols like $
	if (supportedFiatCurrencies.includes(currency.toUpperCase())) {
		return Intl.NumberFormat("en-US", {
			// FIXME:
			style: "decimal", 
			currency,
			maximumFractionDigits: options.compact ? 3 : decimalPlaces,
			notation: options.compact ? "compact" : undefined
		}).format(value.toString() as any);
	}

	// cryptocurrencies are formatted simply using the code (KSM)
	return `${formatNumber(value, { decimalPlaces, compact: options.compact })} ${currency}`;
}


/**
 * Get optimal decimal places for a cryptocurrency to able
 * to represent minimal USD value after rounding.
 *
 * @param usdRate
 * @param minimalUsdValue
 * @param defaultDecimalPlaces
 * @returns
 */
export function getOptimalDecimalPlaces(usdRate: Decimal, minimalUsdValue = new Decimal("0.01")) {
	const cryptoValueOfMinimalUsdValue = minimalUsdValue.div(usdRate);
	const mostSignificantDecimalPlace = cryptoValueOfMinimalUsdValue.log().neg().ceil().toNumber();
	return mostSignificantDecimalPlace;
}
