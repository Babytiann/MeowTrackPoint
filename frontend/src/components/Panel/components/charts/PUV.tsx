import * as echarts from 'echarts';
import fetchData from "../../../../SDK/fetchData.ts";
import processData from "../../../../SDK/processData.ts";
import { useEffect, useState } from "react";

// 定义返回的数据结构类型
interface ChartData {
    demoData?: Array<{ uuid: string; create_at: string; event: string; event_data: string; page_url: string }> ;
    errorData?: unknown;
    timingData?: Array<{ uuid: string; create_at: string; event: string; page_url: string; FP: number; DCL: number; L: number }> ;
    baseInfoData?: Array<{ uuid: string; create_at: string; browser: string; os: string; referrer: string; }> ;
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

        // 获取当前时间，作为结束时间
        const currentDate = new Date();
        currentDate.setSeconds(0, 0);  // 重置秒和毫秒为 0

        // 确保 demoData 是数组类型
        const demoData = chartData?.demoData as Array<{ create_at: string; event: string; uuid: string; page_url: string }>;

        // 计算 PV 和 UV
        if (demoData) {
            // 生成完整的时间段列表（每小时一个）
            const allDates: string[] = [];
            const startDate = new Date(demoData[0]?.create_at);  // 获取第一个数据的日期

            // 重置日期的时分秒为0，以确保按小时计算
            startDate.setUTCHours(0, 0, 0, 0);
            currentDate.setUTCHours(currentDate.getUTCHours() + 8, 0, 0, 0); // 当前时间的整点


            while (startDate <= currentDate) {
                const dateWithHour = `${startDate.toISOString().split('T')[0]} ${startDate.getUTCHours().toString().padStart(2, '0')}`;
                allDates.push(dateWithHour);
                startDate.setUTCHours(startDate.getUTCHours() + 1);  // 下一小时
            }

            const {pvData, uvData} = processData(demoData);

            // 填充所有时间段的数据
            const dates = allDates;
            const pvValues = dates.map(date => pvData[date] || 0);  // 如果没有数据，默认值为 0
            const uvValues = dates.map(date => uvData[date] ? uvData[date].size : 0);  // 如果没有数据，默认值为 0

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
                            start: 80,
                            end: 100,
                            show: true,
                            xAxisIndex: [0],
                        },
                        {
                            type: 'inside',
                            start: 80,
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