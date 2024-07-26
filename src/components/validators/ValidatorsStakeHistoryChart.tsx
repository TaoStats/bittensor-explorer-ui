/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import Chart from "react-apexcharts";
import { css, useTheme } from "@emotion/react";

import LoadingSpinner from "../../assets/loading.svg";
import { nFormatter, rawAmountToDecimal } from "../../utils";
import {
    ValidatorStakeHistory,
    ValidatorsStakeHistoryResponse,
} from "../../model";
import { NETWORK_CONFIG } from "../../config";

const spinnerContainer = css`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
`;

export type ValidatorsStakeHistoryChartProps = {
    stakeHistory: ValidatorsStakeHistoryResponse;
};

export const ValidatorsStakeHistoryChart = (
    props: ValidatorsStakeHistoryChartProps
) => {
    const theme = useTheme();

    const { stakeHistory } = props;

    const loading = stakeHistory.loading;
    const timestamps = useMemo(() => {
        if (!stakeHistory.data) return [];
        const history = stakeHistory.data[0]?.data ?? [];
        return history.map((x: ValidatorStakeHistory) => x.timestamp);
    }, [stakeHistory]);
    const series = useMemo(() => {
        if (!stakeHistory.data) return [];
        const result = [];
        for (const validator of stakeHistory.data) {
            const serie = validator.data.map((vali) =>
                rawAmountToDecimal(
                    vali.nominatorReturnPerK.toString()
                ).toNumber()
            );
            result.push({
                name: validator.address,
                type: "line",
                data: serie,
            });
        }
        return result;
    }, [stakeHistory]);
    const minValue = useMemo(() => {
        return series.reduce(
            (
                min: number,
                cur: {
                    name: string;
                    type: string;
                    data: number[];
                }
            ) => {
                const newMin = cur.data.reduce(
                    (min: number, cur: number) => (min < cur ? min : cur),
                    1
                );
                return min < newMin ? min : newMin;
            },
            1
        );
    }, [series]);
    const maxValue = useMemo(() => {
        return series.reduce(
            (
                max: number,
                cur: {
                    name: string;
                    type: string;
                    data: number[];
                }
            ) => {
                const newMax = cur.data.reduce(
                    (max: number, cur: number) => (max > cur ? max : cur),
                    0
                );
                return max > newMax ? max : newMax;
            },
            0
        );
    }, [series]);

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
                                filename: "top-validators",
                                headerCategory: "Date",
                            },
                            png: {
                                filename: "top-validators",
                            },
                            svg: {
                                filename: "top-validators",
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
                    show: true,
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
                    x: {
                        formatter: (val: number) => {
                            const day = new Date(val);
                            const lastDay = new Date();
                            lastDay.setDate(lastDay.getDate() + 1);
                            if (
                                day.getFullYear() === lastDay.getFullYear() &&
                                day.getMonth() === lastDay.getMonth() &&
                                day.getDate() === lastDay.getDate()
                            )
                                return "Now";
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
                        formatter: (val: number) => {
                            return (
                                NETWORK_CONFIG.currency +
                                " " +
                                nFormatter(val, 3).toString()
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
                    opposite: true,
                    decimalsInFloat: 3,
                    labels: {
                        style: {
                            colors: theme.palette.neutral.main,
                        },
                    },
                    title: {
                        text: "NOM. / 24H / K𝞃",
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
