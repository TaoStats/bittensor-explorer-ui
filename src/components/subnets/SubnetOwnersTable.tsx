import { NETWORK_CONFIG } from "../../config";
import { SubnetOwner, SubnetOwnerResponse } from "../../model";
import {
    AccountAddress,
    BlockTimestamp,
    ItemsTable,
    ItemsTableAttribute,
    Link,
} from "../elements";

export type SubnetOwnersTableProps = {
    subnetOwners: SubnetOwnerResponse;
};

const SubnetOwnersTableAttribute = ItemsTableAttribute<SubnetOwner>;

export function SubnetOwnersTable(props: SubnetOwnersTableProps) {
    const { subnetOwners } = props;
    const { prefix } = NETWORK_CONFIG;

    return (
        <ItemsTable
            data={subnetOwners.data}
            loading={subnetOwners.loading}
            notFoundMessage="No records found for the subnet owner history."
            error={subnetOwners.error}
            data-test="subnet-owners-table"
        >
            <SubnetOwnersTableAttribute
                label="Block"
                render={(subnet) => (
                    <Link to={`/block/${subnet.height}`}>
                        {subnet.height.toString()}
                    </Link>
                )}
            />
            <SubnetOwnersTableAttribute
                label="Registered At"
                render={(subnet) => (
                    <BlockTimestamp blockHeight={subnet.height} />
                )}
            />
            <SubnetOwnersTableAttribute
                label="Owner"
                render={(subnet) => (
                    <AccountAddress
                        address={subnet.owner}
                        prefix={prefix}
                        link
                        copyToClipboard="small"
                    />
                )}
            />
        </ItemsTable>
    );
}
