import * as echarts from 'echarts';
import fetchData from "../../../../SDK/fetchData.ts";
import { useEffect, useState } from "react";

// 定义返回的数据结构类型
interface ChartData {
    demoData?: Array<{ uuid: string; create_at: string; event: string; event_data: string; page_url: string }>;
    errorData?: unknown;
    timingData?: Array<{ uuid: string; create_at: string; event: string;  page_url: string; FP: number ; DCL: number ; L: number }>;
    baseInfoData?: Array<{ uuid: string; create_at: string; browser: string;  os: string; referrer: string; }>;
}

function Home() {
    const [chartData, setChartData] = useState<ChartData | null>(null);

    useEffect(() => {
        fetchData().then((res) => {
            setChartData(res);
        });
    }, []);

    useEffect(() => {
        const chartElement = document.querySelector('.chart') as HTMLDivElement;

        // 确保 demoData 是数组类型
        const demoData = chartData?.demoData as Array<{ create_at: string; event: string; uuid: string; page_url: string }>;

        // 计算 PV 和 UV
        if (demoData) {
            // 用于存储每个日期的 PV 和 UV
            const pvData: { [key: string]: number } = {}; // 日期 => PV
            const uvData: { [key: string]: Set<string> } = {}; // 日期 => UV (存储 unique uuid)

            demoData.forEach(item => {
                if (item.event !== 'puv') return; // 只统计 puv 事件
                const date = item.create_at.split('T')[0]; // 获取日期部分 (格式：YYYY-MM-DD)

                // 统计 PV
                pvData[date] = (pvData[date] || 0) + 1;

                // 统计 UV
                if (!uvData[date]) uvData[date] = new Set();
                uvData[date].add(item.uuid);
            });

            // 将数据整理成符合 ECharts 需求的格式
            const dates = Object.keys(pvData); // 所有日期
            const pvValues = dates.map(date => pvData[date]);
            const uvValues = dates.map(date => uvData[date].size);

            const demoDataForChart = dates.map((date, index) => ({
                date: date,  // 日期
                pv: pvValues[index],  // PV
                uv: uvValues[index],  // UV
            }));

            console.log(demoDataForChart);  // 输出处理后的数据

            if (chartElement) {
                const chart = echarts.init(chartElement);
                const option = {
                    tooltip: {},
                    legend: {
                        data: ['PV', 'UV'],
                    },
                    xAxis: {
                        type: 'category',
                        data: dates,  // 使用日期作为 X 轴数据
                    },
                    yAxis: {
                        type: 'value',
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            start: 0,
                            show: true,
                            end: 100,
                            xAxisIndex: [0],
                        },
                        {
                            type: 'slider',
                            start: 0,
                            show: true,
                            end: 100,
                            yAxisIndex: [0],
                        },{
                            type: 'inside',
                            start: 0,
                            end: 100,
                            xAxisIndex: [0],
                        },
                        {
                            type: 'inside',
                            start: 0,
                            end: 100,
                            yAxisIndex: [0],
                        }
                    ],
                    series: [
                        {
                            name: 'PV',
                            type: 'line',
                            data: pvValues,  // PV 数据
                        },
                        {
                            name: 'UV',
                            type: 'line',
                            data: uvValues,  // UV 数据
                        },
                    ],
                };

                chart.setOption(option);

                window.addEventListener('resize', function () {
                    chart.resize();
                });

                return () => {
                    chart.dispose();
                };
            }
        }
    }, [chartData]); // 依赖 chartData 变化时重新渲染

    return (
        <div className="chart w-full h-full"></div>
    )
}

export default Home;
