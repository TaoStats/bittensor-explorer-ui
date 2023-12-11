/** @jsxImportSource @emotion/react */
import { PaginatedResource } from "../../model/paginatedResource";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { Subnet } from "../../model/subnet";
import { Theme, css } from "@emotion/react";

const successStyle = (theme: Theme) => css`
  font-size: 16px;
  color: ${theme.palette.success.main};
`;

const failedStyle = (theme: Theme) => css`
  font-size: 16px;
  color: ${theme.palette.error.main};
`;

export type SubnetsTableProps = {
	subnets: PaginatedResource<Subnet>;
	registrations?: number[];
	validatorPermits?: number[];
};

const SubnetsTableAttribute = ItemsTableAttribute<Subnet>;

function SubnetsTable(props: SubnetsTableProps) {
	const { subnets, registrations, validatorPermits } = props;

	return (
		<ItemsTable
			data={subnets.data}
			loading={subnets.loading}
			notFound={subnets.notFound}
			notFoundMessage="No subnets found"
			error={subnets.error}
			data-test="subnets-table"
		>
			<SubnetsTableAttribute
				label="ID"
				render={(subnet) => <>{subnet.netUid}</>}
			/>
			<SubnetsTableAttribute
				label="Name"
				render={(subnet) => (
					<Link to={`https://taostats.io/subnets/netuid-${subnet.netUid}`}>
						{subnet.name}
					</Link>
				)}
			/>
			<SubnetsTableAttribute
				label="Registration"
				render={(subnet) =>
					registrations?.find((regist: number) => {
						if(regist.toString() == subnet.netUid.toString())
							return true;
						return false;
					}) ? (
							<span css={successStyle}>&#x1F5F9;</span>
						) : (
							<span css={failedStyle}>&#x1F5F5;</span>
						)
				}
			/>
			<SubnetsTableAttribute
				label="Validator Permits"
				render={(subnet) =>
					validatorPermits?.find((permit: number) => {
						if(permit.toString() == subnet.netUid.toString())
							return true;
						return false;
					}) ? (
							<span css={successStyle}>&#x1F5F9;</span>
						) : (
							<span css={failedStyle}>&#x1F5F5;</span>
						)
				}
			/>
		</ItemsTable>
	);
}

export default SubnetsTable;
