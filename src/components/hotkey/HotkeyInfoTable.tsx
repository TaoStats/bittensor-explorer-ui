/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import { css } from "@emotion/react";
import { NeuronMetagraph } from "../../model";
import { InfoTable, InfoTableAttribute, Link } from "../elements";

const addressItem = css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const whiteText = css`
    color: white;
`;

export type HotkeyInfoTableProps = {
    hotkey: string;
    loading: boolean;
    error: any;
    data: NeuronMetagraph[];
};

const HotkeyInfoTableAttribute = InfoTableAttribute<any>;

export const HotkeyInfoTable = (props: HotkeyInfoTableProps) => {
    const { hotkey, loading, error, data } = props;

    const coldkey = useMemo(() => {
        if (loading) return undefined;
        return data.at(-1)?.coldkey;
    }, [data]);

    return (
        <InfoTable data={props} loading={loading} error={error}>
            <HotkeyInfoTableAttribute
                label="Hotkey"
                render={() => <span css={whiteText}>{hotkey}</span>}
                copyToClipboard={() => hotkey}
            />
            <HotkeyInfoTableAttribute
                label="Coldkey"
                render={() => (
                    <Link
                        href={`/coldkey/${coldkey}`}
                        color="white"
                        target="_self"
                        css={addressItem}
                    >
                        {coldkey} ▶
                    </Link>
                )}
                copyToClipboard={() => coldkey}
            />
        </InfoTable>
    );
};
