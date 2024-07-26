/** @jsxImportSource @emotion/react */
import { NETWORK_CONFIG } from "../../config";
import { Resource, Subnet } from "../../model";
import {
    InfoTableAttribute,
    InfoTable,
    Time,
    AccountAddress,
    Link,
} from "../elements";

export type SubnetInfoTableProps = {
    info: Resource<Subnet>;
    additional: any;
};

const SubnetInfoTableAttribute = InfoTableAttribute<any>;

export const SubnetInfoTable = (props: SubnetInfoTableProps) => {
    const { info, additional } = props;
    const { prefix } = NETWORK_CONFIG;

    return (
        <InfoTable
            data={props}
            loading={info.loading}
            notFound={info.notFound}
            notFoundMessage="No subnet found"
            error={info.error}
        >
            <SubnetInfoTableAttribute
                label="Subnet info"
                render={() => (
                    <Link to={additional.github}>{additional.github}</Link>
                )}
            />
            <SubnetInfoTableAttribute
                label="Registered on"
                render={() => (
                    <Time
                        time={info?.data?.timestamp || -1}
                        utc
                        timezone={false}
                        format="d MMM yyyy HH:mm:ss"
                    />
                )}
            />
            <SubnetInfoTableAttribute
                label="Registered to"
                render={() => (
                    <AccountAddress
                        address={info.data?.owner ?? ""}
                        prefix={prefix}
                        link
                        copyToClipboard="small"
                    />
                )}
            />
        </InfoTable>
    );
};
