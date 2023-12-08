import Decimal from "decimal.js";
import { NETWORK_CONFIG } from "../config";

const supportedFiatCurrencies = ["USD"];

export function rawAmountToDecimal(amount: string | number | undefined) {
	const { decimals } = NETWORK_CONFIG;
	const scale = new Decimal(10).pow(decimals * -1);
	return new Decimal(amount || 0).mul(scale);
}

export function rawAmountToDecimaledString(amount: string | number | undefined) {
	const { decimals } = NETWORK_CONFIG;
	const scale = new Decimal(10).pow(decimals);
	return new Decimal(amount || 0).mul(scale).toString();
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
		maximumFractionDigits: options.compact ? 3 : (options.decimalPlaces === undefined ? 20 : options.decimalPlaces),
		notation: options.compact ? "compact" : undefined
	}).format(value.toString() as any);
}

export function formatNumberWithPrecision(value: number | Decimal, precision: number, disableExponential?: boolean) {
	let formattedNumber = value.toPrecision(precision);

	// Check if the number is in exponential format
	if (disableExponential && formattedNumber.indexOf("e") !== -1) {
		// Convert exponential format to fixed-point notation
		const exponentIndex = formattedNumber.indexOf("e");
		const precision = parseInt(formattedNumber.substring(exponentIndex + 2));
		formattedNumber = Number(formattedNumber).toFixed(precision);
	}
  
	return formattedNumber;
}

export const nFormatter = (num: number, digits: number) => {
	if (Number(num) === 0) return 0;
	const lookup = [
		{ value: 1, symbol: "" },
		{ value: 1e3, symbol: "k" },
		{ value: 1e6, symbol: "m" },
		{ value: 1e9, symbol: "b" },
		{ value: 1e12, symbol: "T" },
		{ value: 1e15, symbol: "P" },
		{ value: 1e18, symbol: "E" },
	];
	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	const item = lookup
		.slice()
		.reverse()
		.find(function (item) {
			return num >= item.value;
		});

	return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : Number(num).toFixed(digits);
};


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

	let decimalPlaces = options.decimalPlaces === undefined ? 20 : options.decimalPlaces;

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
