/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import { css } from "@emotion/react";
import { Resource, SubnetHyperparams } from "../../model";
import { ItemsTable, ItemsTableAttribute } from "../elements";

const capitalizedText = css`
    text-transform: capitalize;
`;

export type SubnetHyperparamTableProps = {
    hyperparams: Resource<SubnetHyperparams>;
};

type SubnetHyperparamTableData = {
    id: string;
    key: string;
    value: string;
};

const SubnetHyperparamTableAttribute =
    ItemsTableAttribute<SubnetHyperparamTableData>;

export function SubnetHyperparamTable(props: SubnetHyperparamTableProps) {
    const { hyperparams } = props;

    const data = useMemo(() => {
        const result: SubnetHyperparamTableData[] = [];
        if (hyperparams.data) {
            const params = hyperparams.data;
            const omitKeys = ["id", "lastUpdate", "timestamp"];
            Object.keys(params).forEach((key) => {
                if (omitKeys.includes(key)) return;
                const value = (params as any)[key];
                const formattedKey = key.replace(/([A-Z])/g, " $1");
                result.push({
                    id: key,
                    key:
                        formattedKey.charAt(0).toUpperCase() +
                        formattedKey.slice(1),
                    value: value
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                });
            });
        }
        return result;
    }, [hyperparams]);

    return (
        <ItemsTable
            data={data}
            loading={hyperparams.loading}
            notFound={hyperparams.notFound}
            notFoundMessage="Could not fetch the hyperparameters for this subnet."
            error={hyperparams.error}
            data-test="hyperparams-table"
        >
            <SubnetHyperparamTableAttribute
                label="Key"
                render={({ key }) => key}
            />
            <SubnetHyperparamTableAttribute
                label="Value"
                render={({ value }) => (
                    <span css={capitalizedText}>{value}</span>
                )}
            />
        </ItemsTable>
    );
}
