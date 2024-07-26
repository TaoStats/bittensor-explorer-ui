/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import Chart from "react-apexcharts";

import LoadingSpinner from "../../assets/loading.svg";
import { useMemo } from "react";
import { nFormatter, rawAmountToDecimal } from "../../utils";
import { NETWORK_CONFIG } from "../../config";
import {
    SubnetRegCostHistoryResponse,
    Resource,
    SingleSubnetStat,
} from "../../model";

const spinnerContainer = css`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
`;

export type NeuronRegistrationChartProps = {
    neuronRegCostHistory: SubnetRegCostHistoryResponse;
    subnetStat: Resource<SingleSubnetStat>;
};

export const NeuronRegistrationChart = (
    props: NeuronRegistrationChartProps
) => {
    const theme = useTheme();

    const { neuronRegCostHistory, subnetStat } = props;

    const loading = neuronRegCostHistory.loading || subnetStat.loading;

    const timestamps = useMemo(() => {
        if (loading) return [];
        const resp: string[] = neuronRegCostHistory.data.map(
            ({ timestamp }) => timestamp
        );
        return [...resp, new Date().toISOString().substring(0, 19)];
    }, [neuronRegCostHistory]);

    const series = useMemo(() => {
        if (loading) return [];
        const resp: number[] = neuronRegCostHistory.data.map(({ regCost }) =>
            rawAmountToDecimal(regCost.toString()).toNumber()
        );
        return [
            ...resp,
            rawAmountToDecimal(subnetStat.data?.regCost.toString()).toNumber(),
        ];
    }, [neuronRegCostHistory]);

    const [minValue, maxValue] = useMemo(() => {
        if (loading) return [0, 0];
        const regCosts = neuronRegCostHistory.data.map(({ regCost }) =>
            rawAmountToDecimal(regCost.toString()).toNumber()
        );
        regCosts.push(
            rawAmountToDecimal(subnetStat.data?.regCost.toString()).toNumber()
        );
        return [Math.min(...regCosts), Math.max(...regCosts)];
    }, [neuronRegCostHistory]);

    return loading ? (
        <div css={spinnerContainer}>
            <img src={LoadingSpinner} />
        </div>
    ) : (
        <Chart
            height={400}
            series={[
                {
                    name: "Cost",
                    type: "line",
                    data: series,
                },
            ]}
            options={{
                chart: {
                    animations: {
                        enabled: false,
                    },
                    background: "transparent",
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
                                filename: "neuron-registration-data",
                                headerCategory: "Date",
                            },
                            png: {
                                filename: "neuron-registration-data",
                            },
                            svg: {
                                filename: "neuron-registration-data",
                            },
                        },
                    },
                    zoom: {
                        enabled: true,
                    },
                },
                colors: ["#14DEC2"],
                dataLabels: {
                    enabled: false,
                },
                grid: {
                    show: false,
                },
                labels: timestamps,
                markers: {
                    size: 0,
                },
                noData: {
                    text: "No subnet registration data yet",
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
                    x: {
                        formatter: (val: number) => {
                            const day = new Date(val);
                            const options: Intl.DateTimeFormatOptions = {
                                day: "2-digit",
                                month: "short",
                                hour: "numeric",
                                minute: "numeric",
                            };
                            const formattedDate = day.toLocaleDateString(
                                "en-US",
                                options
                            );
                            return formattedDate;
                        },
                    },
                    y: {
                        formatter: (val: number) => {
                            return (
                                NETWORK_CONFIG.currency +
                                " " +
                                nFormatter(val, 2).toString()
                            );
                        },
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
                    decimalsInFloat: 2,
                    labels: {
                        style: {
                            colors: theme.palette.success.main,
                        },
                    },
                    title: {
                        text: `Cost (${NETWORK_CONFIG.currency})`,
                        style: {
                            color: theme.palette.success.main,
                        },
                    },
                    axisTicks: {
                        show: false,
                    },
                    axisBorder: {
                        show: false,
                    },
                    min: minValue - 0.01,
                    max: maxValue + 0.01,
                    tickAmount:
                        Math.min(8, Math.ceil((maxValue - minValue) / 0.01)) +
                        2,
                },
            }}
        />
    );
};
