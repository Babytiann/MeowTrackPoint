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

type DateRange = 'today' | 'week' | 'month' | 'year';

function Home() {
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [dateRange, setDateRange] = useState<DateRange>('week');  // 默认选中“当天”

    useEffect(() => {
        fetchData().then((res) => {
            setChartData(res);
        });
    }, []);

    // 计算日期范围
    const getDateRange = (range: DateRange) => {
        const currentDate = new Date();
        const startDate = new Date(currentDate);

        switch (range) {
            case 'today':
                startDate.setHours(0, 0, 0, 0);  // 当天从00:00开始
                break;
            case 'week':
                { const dayOfWeek = currentDate.getDay();
                const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;  // 处理周日作为一周开始的情况
                startDate.setDate(currentDate.getDate() + diffToMonday);  // 一周的开始日期（周一）
                startDate.setHours(0, 0, 0, 0);
                break; }
            case 'month':
                startDate.setDate(1);  // 当前月的第一天
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'year':
                startDate.setMonth(0, 1);  // 当前年的第一天
                startDate.setHours(0, 0, 0, 0);
                break;
            default:
                break;
        }

        return startDate;
    };


    useEffect(() => {
        const chartElement = document.querySelector('.chart') as HTMLDivElement;

        // 获取当前时间，作为结束时间
        const currentDate = new Date();
        currentDate.setSeconds(0, 0);  // 重置秒和毫秒为 0

        // 确保 demoData 是数组类型
        const demoData = chartData?.demoData as Array<{ create_at: string; event: string; uuid: string; page_url: string }> ?? [];

        // 计算选择的日期范围的开始日期
        const startDate = getDateRange(dateRange);

        const filteredData = demoData.filter(item => {
            const itemDate = new Date(item.create_at);
            return itemDate >= startDate && itemDate <= currentDate;
        });



        // 计算 PV 和 UV
        if (filteredData.length > 0) {
            // 生成完整的时间段列表（每小时一个）
            const allDates: string[] = [];
            const firstDataDate = new Date(filteredData[0]?.create_at);

            // 重置日期的时分秒为0，以确保按小时计算
            firstDataDate.setUTCHours(0, 0, 0, 0);
            currentDate.setUTCHours(currentDate.getUTCHours() + 8, 0, 0, 0); // 当前时间的整点

            while (firstDataDate <= currentDate) {
                const dateWithHour = `${firstDataDate.toISOString().split('T')[0]} ${firstDataDate.getUTCHours().toString().padStart(2, '0')}`;
                allDates.push(dateWithHour);
                firstDataDate.setUTCHours(firstDataDate.getUTCHours() + 1);  // 下一小时
            }

            const {pvData, uvData} = processData(filteredData);

            // 填充所有时间段的数据
            const dates = allDates;
            const pvValues = dates.map(date => pvData[date] || 0);  // 如果没有数据，默认值为 0
            const uvValues = dates.map(date => uvData[date] ? uvData[date].size : 0);  // 如果没有数据，默认值为 0



            if (chartElement) {
                const chart = echarts.init(chartElement);
                const option = {
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
                            type: "cross"
                        },
                    },
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
                            end: 100,
                            show: true,
                            xAxisIndex: [0],
                        },
                        {
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
    }, [chartData, dateRange]); // 依赖 chartData 和 dateRange 变化时重新渲染

    return (
        <div className="w-full h-full">
            {/* 日期筛选器 */}
            <div className="filters">
                <select value={dateRange} onChange={(e) => setDateRange(e.target.value as DateRange)}>
                    <option value="today">当天</option>
                    <option value="week">本周</option>
                    <option value="month">本月</option>
                    <option value="year">全年</option>
                </select>
            </div>

            <div className="chart w-full h-full"></div>
        </div>
    );
}

export default Home;