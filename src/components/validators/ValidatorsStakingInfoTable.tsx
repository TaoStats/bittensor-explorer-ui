/** @jsxImportSource @emotion/react */
import { useMemo, useState } from "react";
import { AccountAddress } from "../AccountAddress";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { NETWORK_CONFIG } from "../../config";
import { SortDirection } from "../../model/sortDirection";
import { SortOrder } from "../../model/sortOrder";
import { Validator } from "../../model/validator";
import { formatNumber } from "../../utils/number";

export type ValidatorsStakingInfoTableProps = {
	validators: any[];
	selected: Validator | undefined;
};

const ValidatorsStakingInfoTableAttribute = ItemsTableAttribute<any>;

function ValidatorsStakingInfoTable(props: ValidatorsStakingInfoTableProps) {
	const { validators, selected } = props;

	const { currency, prefix } = NETWORK_CONFIG;

	const [sort, setSort] = useState<SortOrder<string>>({
		property: "amount",
		direction: SortDirection.DESC,
	});

	const handleSortChange = (property?: string) => {
		if (!property) return;
		if (property === sort?.property) {
			setSort({
				...sort,
				direction:
					sort.direction === SortDirection.ASC
						? SortDirection.DESC
						: SortDirection.ASC,
			});
		} else {
			setSort({
				property,
				direction: SortDirection.DESC,
			});
		}
	};

	const sortedValis = useMemo(() => {
		return validators.sort((leftObj, rightObj) => {
			const leftVal = leftObj[sort.property ?? ""],
				rightVal = rightObj[sort.property ?? ""];
			if (sort.direction === SortDirection.ASC) return leftVal - rightVal;
			return rightVal - leftVal;
		});
	}, [validators, sort]);

	return (
		<ItemsTable
			data={sortedValis}
			notFoundMessage="No validators found"
			data-test="validators-table"
			showRank
			active={selected?.id}
			sort={sort}
			onSortChange={handleSortChange}
		>
			<ValidatorsStakingInfoTableAttribute
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
						<Link to={`/validator/${validator.address}`}>{validator.name}</Link>
					)
				}
			/>

			<ValidatorsStakingInfoTableAttribute
				label={`${NETWORK_CONFIG.currency}/day`}
				render={({ dailyTAO }) => {
					return (
						<>
							{formatNumber(dailyTAO, { decimalPlaces: 4 })}
							{currency}
						</>
					);
				}}
				sortable
				sortProperty="dailyTAO"
			/>

			<ValidatorsStakingInfoTableAttribute
				label="$/day"
				render={({ dailyUSD }) => {
					return <>${formatNumber(dailyUSD, { decimalPlaces: 2 })}</>;
				}}
				sortable
				sortProperty="dailyUSD"
			/>

			<ValidatorsStakingInfoTableAttribute
				label={`${NETWORK_CONFIG.currency}/month`}
				render={({ monthlyTAO }) => {
					return (
						<>
							{formatNumber(monthlyTAO, { decimalPlaces: 2 })}
							{currency}
						</>
					);
				}}
				sortable
				sortProperty="monthlyTAO"
			/>

			<ValidatorsStakingInfoTableAttribute
				label="$/month"
				render={({ monthlyUSD }) => {
					return <>${formatNumber(monthlyUSD, { decimalPlaces: 2 })}</>;
				}}
				sortable
				sortProperty="monthlyUSD"
			/>

			<ValidatorsStakingInfoTableAttribute
				label={`${NETWORK_CONFIG.currency}/year`}
				render={({ yearlyTAO }) => {
					return (
						<>
							{formatNumber(yearlyTAO, { decimalPlaces: 2 })}
							{currency}
						</>
					);
				}}
				sortable
				sortProperty="yearlyTAO"
			/>

			<ValidatorsStakingInfoTableAttribute
				label="$/year"
				render={({ yearlyUSD }) => {
					return <>${formatNumber(yearlyUSD, { decimalPlaces: 2 })}</>;
				}}
				sortable
				sortProperty="yearlyUSD"
			/>

			<ValidatorsStakingInfoTableAttribute
				label="APR"
				align="right"
				render={({ apr }) => {
					return <>{apr.toFixed(2)}%</>;
				}}
				sortable
				sortProperty="apr"
			/>

			<ValidatorsStakingInfoTableAttribute
				label={`NOM./24h/k${currency}`}
				align="right"
				render={({ nom }) => {
					return (
						<>
							{nom.toFixed(3)}
							{currency}
						</>
					);
				}}
				sortable
				sortProperty="nom"
			/>
		</ItemsTable>
	);
}

export default ValidatorsStakingInfoTable;
