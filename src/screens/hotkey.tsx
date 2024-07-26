/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { css } from "@emotion/react";
import {
    Card,
    HotkeyInfoTable,
    TabbedContent,
    TabPane,
    ExtrinsicsTable,
    HotkeyPerformanceChart,
    HotkeyMetagraphTable,
} from "../components";
import { useExtrinsics, useHotkeyNet, useAddressInfo } from "../hooks";

const perfContainer = css`
    margin-top: 50px;
`;

const perfSubnet = css`
    font-size: 14px;
    min-width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.06);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    padding: 0 8px;
    margin: 5px 10px;
    cursor: pointer;
`;

const activePerfSubnet = css`
    box-shadow: 0 0 8px 0 #ff990085 inset;
`;

export type HotkeyPageParams = {
    hkey: string;
};

export const HotkeyPage = () => {
    const { hkey } = useParams() as HotkeyPageParams;

    const extrinsics = useExtrinsics(
        { signer: { equalTo: hkey } },
        "BLOCK_HEIGHT_DESC"
    );

    const neuronMetagraph = useHotkeyNet(hkey);

    const {
        data: { loading, isHotkey, isValidator },
    } = useAddressInfo(hkey);

    const [activeSubnet, setActiveSubnet] = useState(-1);
    useEffect(() => {
        const firstId = neuronMetagraph.data?.at(0)?.netUid || -1;
        if (activeSubnet === -1 && firstId !== -1) setActiveSubnet(firstId);
    }, [neuronMetagraph]);

    const { hash: tab } = useLocation();
    useEffect(() => {
        if (tab) {
            document.getElementById(tab)?.scrollIntoView();
            window.scrollBy(0, -175);
        } else {
            window.scrollTo(0, 0);
        }
    }, [tab]);

    if (isValidator) {
        return <Navigate to={`/validator/${hkey}`} replace />;
    }

    if (!loading && !isHotkey) {
        return <Navigate to={`/account/${hkey}`} replace />;
    }

    return (
        <>
            <Card>
                <HotkeyInfoTable hotkey={hkey} {...neuronMetagraph} />
            </Card>
            <Card>
                <TabbedContent defaultTab={tab.slice(1).toString()}>
                    <TabPane
                        label="Metagraph"
                        loading={neuronMetagraph.loading}
                        error={!!neuronMetagraph.error}
                        value="metagraph"
                    >
                        <HotkeyMetagraphTable {...neuronMetagraph} />
                    </TabPane>
                    <TabPane
                        label="extrinsics"
                        loading={extrinsics.loading}
                        error={extrinsics.error}
                        value="extrinsics"
                    >
                        <ExtrinsicsTable extrinsics={extrinsics} showTime />
                    </TabPane>
                </TabbedContent>
            </Card>
            <Card>
                <div css={perfContainer}>
                    <div>
                        {neuronMetagraph.data.map(({ netUid }) => (
                            <div
                                css={[
                                    perfSubnet,
                                    netUid === activeSubnet
                                        ? activePerfSubnet
                                        : undefined,
                                ]}
                                key={`perf_subnet_${netUid}`}
                                onClick={() => setActiveSubnet(netUid)}
                            >
                                SN{netUid}
                            </div>
                        ))}
                    </div>
                    {activeSubnet > -1 && (
                        <HotkeyPerformanceChart
                            netUid={activeSubnet}
                            hotkey={hkey}
                        />
                    )}
                </div>
            </Card>
        </>
    );
};
