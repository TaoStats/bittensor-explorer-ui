/** @jsxImportSource @emotion/react */
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { Validator } from "../../model/validator";
import { NETWORK_CONFIG } from "../../config";
import { AccountAddress } from "../AccountAddress";
import { Currency } from "../Currency";
import { DataError } from "../../utils/error";
// import { css } from "@emotion/react";

export type ValidatorsTableProps = {
	validators: {
		loading: boolean;
		error?: DataError;
		data: Validator[];
	};
};

// const day_change_css = css`
//   font-size: small;
//   font-weight: bold;
//   margin-left: 10px;
// `;

const ValidatorsTableAttribute = ItemsTableAttribute<Validator>;

function ValidatorsTable(props: ValidatorsTableProps) {
	const { validators } = props;

	const { currency, prefix } = NETWORK_CONFIG;

	return (
		<ItemsTable
			data={validators.data}
			loading={validators.loading}
			notFoundMessage="No validators found"
			error={validators.error}
			data-test="validators-table"
		>
			<ValidatorsTableAttribute
				label="Rank"
				render={(validator) => <>{validator.rank}</>}
			/>
			<ValidatorsTableAttribute
				label="Validator"
				render={(validator) =>
					validator.name === undefined ? (
						<AccountAddress
							address={validator.address}
							prefix={prefix}
							shorten
							delegate
							copyToClipboard="small"
						/>
					) : (
						<Link to={`/validators/${validator.address}`}>
							{validator.name}
						</Link>
					)
				}
			/>
			<ValidatorsTableAttribute
				label="Stake"
				align="right"
				render={(validator) => {
					return (
						<Currency
							amount={validator.amount}
							currency={currency}
							decimalPlaces={0}
							showFullInTooltip
						/>
					);
				}}
			/>
			{/*
			<ValidatorsTableAttribute
				label=""
				colCss={css`
					padding-left: 0px;
				`}
				render={(validator) => {
					const change24h = validator.amountChange;
					return (
						<>
							{change24h != BigInt("0") && (
								<span
									css={day_change_css}
									className={`${change24h > 0 ? "up" : "down"}`}
								>
									{change24h > 0 ? "▴" : "▾"}
									<Currency
										amount={change24h > 0 ? change24h : -change24h}
										currency={currency}
										decimalPlaces={0}
										showFullInTooltip
									/>
								</span>
							)}
						</>
					);
				}}
			/>
			*/}

			<ValidatorsTableAttribute
				label="Nominators"
				align="right"
				render={(validator) => {
					return <>{validator.nominators}</>;
				}}
			/>
			{/*<ValidatorsTableAttribute
				label=""
				colCss={css`padding-left: 0px;`}
				render={(validator) => {
					const change24h = validator.nominatorChange;
					return (
						<>
							{change24h != BigInt("0") && (
								<span
									css={day_change_css}
									className={`${change24h > 0 ? "up" : "down"}`}
								>
									{change24h > 0 ? "▴" : "▾"}
									<>{(change24h > 0 ? change24h : -change24h).toString()}</>
								</span>
							)}
						</>
					);
				}}
			/>
				 */}
		</ItemsTable>
	);
}

export default ValidatorsTable;
