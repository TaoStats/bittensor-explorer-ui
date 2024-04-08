/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { SubnetHyperparam } from "../../model/subnet";
import { Resource } from "../../model/resource";

export type SubnetHyperparamTableProps = {
	hyperparam: Resource<SubnetHyperparam>;
};

type SubnetHyperparamTableData = {
	id: string;
	key: string;
	value: string;
};

const SubnetHyperparamTableAttribute =
	ItemsTableAttribute<SubnetHyperparamTableData>;

function SubnetHyperparamTable(props: SubnetHyperparamTableProps) {
	const { hyperparam } = props;

	const data = useMemo(() => {
		const result: SubnetHyperparamTableData[] = [];
		if (hyperparam.data) {
			const params = hyperparam.data;
			const omitKeys = ["id", "lastUpdate", "timestamp"];
			Object.keys(params).forEach((key) => {
				if (!omitKeys.includes(key)) {
					const value = (params as any)[key];
					const formattedKey = key.replace(/([A-Z])/g, " $1");
					const formattedValue =
						typeof value === "boolean"
							? value === true
								? "True"
								: "False"
							: value.toString();
					result.push({
						id: key,
						key: formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1),
						value: formattedValue,
					});
				}
			});
		}
		return result;
	}, [hyperparam]);

	return (
		<ItemsTable
			data={data}
			loading={hyperparam.loading}
			notFound={hyperparam.notFound}
			notFoundMessage="No subnet hyperparams."
			error={hyperparam.error}
			data-test="metagraph-table"
		>
			<SubnetHyperparamTableAttribute label="Key" render={({ key }) => key} />
			<SubnetHyperparamTableAttribute
				label="Value"
				render={({ value }) => value}
			/>
		</ItemsTable>
	);
}

export default SubnetHyperparamTable;
