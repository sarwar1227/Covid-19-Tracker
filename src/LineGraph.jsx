import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';
import './LineGraph.css';

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
}

const LineGraph = ({ casesType = 'cases' }) => {
    const [data, setData] = useState({});

    const buildChartData = (data, casesType = "cases") => {
        const chartData = [];
        let lastDataPoint;

        for (let date in data.cases) {
            if (lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] = lastDataPoint,
                }
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        };
        return chartData;
    }

    useEffect(() => {
        const getData = async () => {
            const json_data = await fetch('https://disease.sh/v3/covid-19/historical/all?Lastdays=120');
            const converted_data = await json_data.json();
            const chartData = buildChartData(converted_data, casesType);
            setData(chartData);
        }
        getData();
    }, [casesType]);


    return (
        <>
            <div class="graph">
                {
                    data?.length > 0 &&
                    (
                        <Line
                            options={options}
                            data={{
                                datasets: [
                                    {
                                        backgroundColor: "pink",
                                        borderColor: "red",
                                        data: data,
                                    },
                                ],
                            }}
                        />
                    )
                }
            </div>
        </>
    );
}

export default LineGraph;