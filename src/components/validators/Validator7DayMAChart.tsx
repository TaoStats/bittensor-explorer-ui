/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import Chart from "react-apexcharts";
import { css, useTheme } from "@emotion/react";

import LoadingSpinner from "../../assets/loading.svg";
import { nFormatter, rawAmountToDecimal } from "../../utils";
import { ValidatorMovingAverageResponse } from "../../model";
import { NETWORK_CONFIG } from "../../config";

const spinnerContainer = css`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
`;

export type Validator7DayMAChartProps = {
    address: string;
    movingAverage: ValidatorMovingAverageResponse;
};

export const Validator7DayMAChart = (props: Validator7DayMAChartProps) => {
    const theme = useTheme();

    const { address, movingAverage } = props;

    const loading = movingAverage.loading;
    const timestamps = useMemo(() => {
        if (!movingAverage.data) return [];
        return movingAverage.data.map(({ timestamp }) => timestamp);
    }, [movingAverage]);
    const weeklyAvg = useMemo(() => {
        if (!movingAverage.data) return [];
        return movingAverage.data.map(({ normWeeklyAvg }) =>
            rawAmountToDecimal(normWeeklyAvg.toString()).toNumber()
        );
    }, [movingAverage]);
    const [minWeeklyAvg, maxWeeklyAvg] = useMemo(() => {
        if (!movingAverage.data) return [0, 0];
        const data = movingAverage.data.map(({ normWeeklyAvg }) =>
            rawAmountToDecimal(normWeeklyAvg.toString()).toNumber()
        );
        return [Math.min(...data), Math.max(...data)];
    }, [movingAverage]);
    const take = useMemo(() => {
        if (!movingAverage.data) return [];
        return movingAverage.data.map(({ take }) => (take / 65535) * 100);
    }, [movingAverage]);

    return loading ? (
        <div css={spinnerContainer}>
            <img src={LoadingSpinner} />
        </div>
    ) : (
        <Chart
            height={400}
            series={[
                {
                    name: `NOM./7d/K${NETWORK_CONFIG.currency} 7DMA`,
                    type: "area",
                    data: weeklyAvg,
                },
                {
                    name: "Take",
                    type: "area",
                    data: take,
                },
            ]}
            options={{
                chart: {
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
                                filename: `norminator-return-${address}`,
                                headerCategory: "Date",
                            },
                            png: {
                                filename: `norminator-return-${address}`,
                            },
                            svg: {
                                filename: `norminator-return-${address}`,
                            },
                        },
                    },
                    zoom: {
                        enabled: true,
                    },
                },
                colors: [
                    theme.palette.success.main,
                    theme.palette.neutral.main,
                ],
                dataLabels: {
                    enabled: false,
                },
                fill: {
                    type: "gradient",
                    gradient: {
                        shade: "dark",
                        shadeIntensity: 1,
                        inverseColors: false,
                        type: "vertical",
                        opacityFrom: 0.6,
                        opacityTo: 0.1,
                        stops: [0, 90, 100],
                    },
                },
                grid: {
                    show: false,
                },
                labels: timestamps,
                legend: {
                    show: false,
                },
                markers: {
                    size: 0,
                },
                noData: {
                    text: "No records yet",
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
                    width: 1,
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
                            };
                            const formattedDate = day.toLocaleDateString(
                                "en-US",
                                options
                            );
                            return formattedDate;
                        },
                    },
                    y: {
                        formatter: (val: number, { seriesIndex }) => {
                            if (seriesIndex === 0)
                                return (
                                    NETWORK_CONFIG.currency +
                                    " " +
                                    nFormatter(val, 3).toString()
                                );
                            return nFormatter(val, 2).toString() + "%";
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
                yaxis: [
                    {
                        labels: {
                            style: {
                                colors: theme.palette.success.main,
                            },
                            formatter: (val: number) =>
                                nFormatter(val, 3).toString(),
                        },
                        title: {
                            text: `NOM./7d/K${NETWORK_CONFIG.currency} 7DMA`,
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
                        min: minWeeklyAvg,
                        max: maxWeeklyAvg,
                    },
                    {
                        opposite: true,
                        labels: {
                            style: {
                                colors: theme.palette.neutral.main,
                            },
                            formatter: (val: number) =>
                                nFormatter(val, 2).toString(),
                        },
                        title: {
                            text: "Take (%)",
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
                        min: 0,
                        max: 20,
                    },
                ],
            }}
        />
    );
};
