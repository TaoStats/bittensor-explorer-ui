/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import Chart from "react-apexcharts";
import { css, useTheme } from "@emotion/react";

import LoadingSpinner from "../../assets/loading.svg";
import { formatCurrency, rawAmountToDecimal } from "../../utils";
import { SubnetHistory, SubnetHistoryResponse } from "../../model";
import { NETWORK_CONFIG } from "../../config";

const spinnerContainer = css`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
`;

export type SubnetTaoRecycled24HHistoryChartProps = {
    subnetHistory: SubnetHistoryResponse;
    subnetId: string;
};

export const SubnetTaoRecycled24HHistoryChart = (
    props: SubnetTaoRecycled24HHistoryChartProps
) => {
    const theme = useTheme();

    const { subnetHistory, subnetId } = props;
    const { currency } = NETWORK_CONFIG;

    const loading = subnetHistory.loading;
    const timestamps = useMemo(() => {
        if (!subnetHistory.data) return [];
        const defaultSubnetId = subnetHistory.data[0]?.netUid.toString();
        return subnetHistory.data
            .filter((x) => x.netUid.toString() == defaultSubnetId)
            .map((x: SubnetHistory) => x.timestamp);
    }, [subnetHistory]);

    const series = useMemo(() => {
        if (!subnetHistory.data) return [];

        const subnets: any = {};
        for (const subnet of subnetHistory.data) {
            const { netUid, recycled24H } = subnet;
            const subnetIdStr = netUid.toString();

            const data = rawAmountToDecimal(recycled24H.toString()).toNumber();
            if (!subnets[subnetIdStr]) {
                subnets[subnetIdStr] = {
                    name: "",
                    type: "line",
                    data: [],
                };
            }
            subnets[subnetIdStr].data.push(data);
        }

        const result: any = [];
        for (const x in subnets) {
            result.push(subnets[x]);
        }

        return result;
    }, [subnetHistory]);

    const [minValue, maxValue] = useMemo(() => {
        const data = subnetHistory.data.map(({ recycled24H }) =>
            rawAmountToDecimal(recycled24H.toString()).toNumber()
        );
        return [Math.min(...data), Math.max(...data)];
    }, [subnetHistory]);

    return loading ? (
        <div css={spinnerContainer}>
            <img src={LoadingSpinner} />
        </div>
    ) : (
        <Chart
            height={400}
            series={series}
            options={{
                chart: {
                    animations: {
                        enabled: false,
                    },
                    background: "#1a1a1a",
                    toolbar: {
                        show: true,
                        offsetX: 0,
                        offsetY: 0,
                        autoSelected: "pan",
                        tools: {
                            selection: true,
                            zoom: true,
                            zoomin: true,
                            zoomout: true,
                            pan: true,
                        },
                        export: {
                            csv: {
                                filename: `subnet-${subnetId}`,
                                headerCategory: "Date",
                            },
                            png: {
                                filename: `subnet-${subnetId}`,
                            },
                            svg: {
                                filename: `subnet-${subnetId}`,
                            },
                        },
                    },
                    zoom: {
                        enabled: true,
                    },
                },
                colors: [
                    "#14DEC2",
                    "#29D8B0",
                    "#3FD19F",
                    "#54CB8D",
                    "#69C57B",
                    "#7FBF6A",
                    "#94B858",
                    "#AAB247",
                    "#BFAC35",
                    "#D4A623",
                    "#EA9F12",
                    "#FF9900",
                ],
                dataLabels: {
                    enabled: false,
                },
                grid: {
                    show: false,
                },
                labels: timestamps,
                legend: {
                    show: false,
                    showForSingleSeries: true,
                    position: "top",
                    horizontalAlign: "right",
                    labels: {
                        colors: "#d9d9d9",
                    },
                },
                markers: {
                    size: 0,
                },
                noData: {
                    text: "No validators yet",
                    align: "center",
                    verticalAlign: "middle",
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        color: "#FFFFFF",
                    },
                },
                responsive: [
                    {
                        breakpoint: 767,
                        options: {
                            chart: {
                                height: 320,
                            },
                        },
                    },
                    {
                        breakpoint: 599,
                        options: {
                            chart: {
                                height: 270,
                            },
                        },
                    },
                ],
                stroke: {
                    curve: "smooth",
                    width: 2,
                },
                tooltip: {
                    theme: "dark",
                    shared: true,
                    intersect: false,
                    marker: {
                        show: false,
                    },
                    x: {
                        formatter: (val: number) => {
                            const day = new Date(val);
                            const options: Intl.DateTimeFormatOptions = {
                                day: "2-digit",
                                month: "short",
                                year: "2-digit",
                            };
                            const formattedDate = day.toLocaleDateString(
                                "en-US",
                                options
                            );
                            return formattedDate;
                        },
                    },
                    y: {
                        formatter: (val: number) =>
                            formatCurrency(val, "USD", { decimalPlaces: 2 }) +
                            ` ${currency}`,
                    },
                },
                xaxis: {
                    axisTicks: {
                        show: false,
                    },
                    axisBorder: {
                        show: false,
                    },
                    labels: {
                        style: {
                            fontSize: "11px",
                            colors: "#7F7F7F",
                        },
                    },
                    type: "datetime",
                },
                yaxis: {
                    opposite: true,
                    decimalsInFloat: 0,
                    tickAmount: 5,
                    labels: {
                        style: {
                            colors: theme.palette.neutral.main,
                        },
                    },
                    title: {
                        text: "TAO RECYCLED (24H)",
                        style: {
                            color: theme.palette.neutral.main,
                        },
                    },
                    axisTicks: {
                        show: false,
                    },
                    axisBorder: {
                        show: false,
                    },
                    min: minValue,
                    max: maxValue,
                },
            }}
        />
    );
};
