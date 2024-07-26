/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import { css, useTheme } from "@emotion/react";
import Chart from "react-apexcharts";
import LoadingSpinner from "../../assets/loading.svg";
import {
    Resource,
    SubnetRegCostHistoryResponse,
    SubnetStat,
} from "../../model";
import { nFormatter, rawAmountToDecimal } from "../../utils";
import { NETWORK_CONFIG } from "../../config";

const spinnerContainer = css`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
`;

export type SubnetRegistrationChartProps = {
    subnetRegCostHistory: SubnetRegCostHistoryResponse;
    subnetStat: Resource<SubnetStat>;
};

export const SubnetRegistrationChart = (
    props: SubnetRegistrationChartProps
) => {
    const theme = useTheme();

    const { subnetRegCostHistory, subnetStat } = props;

    const loading = subnetRegCostHistory.loading || subnetStat.loading;

    const timestamps = useMemo(() => {
        if (loading) return [];
        const resp: string[] = subnetRegCostHistory.data.map(
            ({ timestamp }) => timestamp
        );
        return [...resp, new Date().toISOString().substring(0, 19)];
    }, [subnetRegCostHistory]);

    const series = useMemo(() => {
        if (loading) return [];
        const resp: number[] = subnetRegCostHistory.data.map(({ regCost }) =>
            rawAmountToDecimal(regCost.toString()).toNumber()
        );
        return [
            ...resp,
            rawAmountToDecimal(subnetStat.data?.regCost.toString()).toNumber(),
        ];
    }, [subnetRegCostHistory]);

    const [minValue, maxValue] = useMemo(() => {
        if (loading) return [0, 0];
        const costs = subnetRegCostHistory.data.map(({ regCost }) =>
            rawAmountToDecimal(regCost.toString()).toNumber()
        );
        costs.push(
            rawAmountToDecimal(subnetStat.data?.regCost.toString()).toNumber()
        );
        return [Math.min(...costs), Math.max(...costs)];
    }, [subnetRegCostHistory]);

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
                                filename: "subnet-registration-data",
                                headerCategory: "Date",
                            },
                            png: {
                                filename: "subnet-registration-data",
                            },
                            svg: {
                                filename: "subnet-registration-data",
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
                                year: "2-digit",
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
                    decimalsInFloat: 0,
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
                    min: minValue,
                    max: maxValue,
                },
            }}
        />
    );
};
