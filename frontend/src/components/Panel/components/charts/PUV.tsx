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

            // 生成完整的时间段列表（每小时一个）
            const allDates: string[] = [];
            const startDate = new Date(demoData[0]?.create_at);  // 获取第一个数据的日期
            const endDate = new Date(demoData[demoData.length - 1]?.create_at);  // 获取最后一个数据的日期
            while (startDate <= endDate) {
                const dateWithHour = `${startDate.toISOString().split('T')[0]} ${startDate.getHours().toString().padStart(2, '0')}`;
                allDates.push(dateWithHour);
                startDate.setHours(startDate.getHours() + 1);  // 下一小时
            }

            demoData.forEach(item => {
                if (item.event !== 'puv') return; // 只统计 puv 事件

                const dateWithTime = item.create_at.split('T').join(' '); // 获取格式 "YYYY-MM-DD HH:mm:ss"
                let hour = parseInt(dateWithTime.split(' ')[1].split(':')[0], 10);  // 提取小时部分，后面的10表示使用十进制
                hour = (hour + 8) % 24;       // 加 8 小时，确保不超过 24 小时
                const dateWithHour = dateWithTime.split(' ')[0] + ' ' + (hour < 10 ? '0' + hour : hour); // 获取格式 "YYYY-MM-DD HH"

                // 统计 PV
                pvData[dateWithHour] = (pvData[dateWithHour] || 0) + 1;

                // 统计 UV
                if (!uvData[dateWithHour]) uvData[dateWithHour] = new Set();
                uvData[dateWithHour].add(item.uuid);
            });

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
