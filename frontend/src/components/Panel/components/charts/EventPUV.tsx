import * as echarts from 'echarts';
import fetchData from "../../../../services/fetchData.ts";
import processPuvData from "../../../../services/chartsFunction/processPuvData.ts";
import processDate from "../../../../services/chartsFunction/processDate.ts";
import generateFallbackDates from "../../../../services/chartsFunction/generateFallbackDates.ts";

import { useEffect, useState, useRef } from "react";
import { Select } from 'antd';

function EventPUV({ events }: Readonly<HomeProps>) {
    const [chartData, setChartData] = useState<TableData | null>(null);
    const [dateRange, setDateRange] = useState<DateRange>('week');  // 默认选中“本周”
    const [eventType, setEventType] = useState<string>('total');

    const [chartType, setChartType] = useState<'line'>("line");
    const optionList = useRef<{ label: string; value: string }[]>([]);
    const chartInstance = useRef<echarts.ECharts | null>(null);

    useEffect(() => {
        fetchData().then((res) => {
            setChartData(res);
            console.log(res);
        });
    }, []);

    // 处理图表渲染
    useEffect(() => {
        const chartElement = document.querySelector('.EventChart') as HTMLDivElement;
        if (!chartElement || !chartData) return;

        // 获取日期范围（即使没有数据）
        const { filteredData = [], allDates = [] } = processDate(chartData?.demoData, dateRange) || {};

        // 强制生成日期范围（兼容空数据）
        const safeDates = allDates.length > 0 ? allDates : generateFallbackDates(dateRange);

        // 更新 optionList 数据
        optionList.current = Array.from(
            new Set(
                chartData.demoData
                    ?.filter(item => {
                        return (item.event !== 'puv') && events.includes(item.event);
                    })
                    .map(item => item.event)
            )
        ).map(event => ({
            label: event,
            value: event
        }));

        optionList.current.push({ label: 'total', value: 'total' });

        // 为选择的事件类型生成数据
        const series: SeriesData[] = [];

        // 判断是否处理所有事件（total模式）
        const shouldProcessTotal = eventType === 'total' && optionList.current.length > 1;

        if (shouldProcessTotal) {
            // 处理所有事件
            optionList.current.forEach((option) => {
                if (option.value === 'total') return;
                const { pvData, uvData } = processPuvData(filteredData, option.value);

                series.push(
                    {
                        name: `${option.value} PV`,
                        // 根据选择的 chartType 设置图表类型
                        type: chartType,
                        data: safeDates.map(date => pvData[date] || 0)
                    },
                    {
                        name: `${option.value} UV`,
                        type: chartType,
                        data: safeDates.map(date => uvData[date]?.size || 0)
                    }
                );
            });
        } else if (events.includes(eventType)) {
            // 如果选择了某一特定事件类型
            const { pvData, uvData } = processPuvData(filteredData, eventType);

            const pvValues = allDates.map(date => pvData[date] || 0);
            const uvValues = allDates.map(date => uvData[date]?.size || 0);

            series.push(
                { name: `${eventType} PV`, type: chartType, data: pvValues },
                { name: `${eventType} UV`, type: chartType, data: uvValues }
            );
        }

        // 初始化或更新图表
        if (!chartInstance.current) {
            chartInstance.current = echarts.init(chartElement, 'chalk');
        }

        const option = {
            title: {
                text: '事件PV & UV',
                left: 'center',
                textStyle: {
                    color: '#333',
                },
            },
            tooltip: {
                trigger: "axis",
                axisPointer: { type: "cross" }
            },
            legend: {
                data: series.map(item => item.name),
                left: 'left',
                orient: "vertical",
                itemGap: 20
            },
            xAxis: {
                type: 'category',
                data: safeDates
            },
            yAxis: {
                type: 'value'
            },
            dataZoom: [
                { type: 'slider', start: 0, end: 100, xAxisIndex: [0] },
                { type: 'inside', xAxisIndex: [0] },
                { type: 'inside', yAxisIndex: [0] }
            ],
            series: series
        };

        chartInstance.current.setOption(option);

        // 窗口大小调整时重新渲染图表
        const resizeHandler = () => chartInstance.current?.resize();
        window.addEventListener('resize', resizeHandler);

        return () => {
            window.removeEventListener('resize', resizeHandler);
            chartInstance.current?.dispose();
            chartInstance.current = null;
        };
        // 将 chartType 添加到依赖数组中，切换图表类型时重新渲染
    }, [chartData, dateRange, eventType, events, chartType]);

    return (
        <div className="w-full h-full relative">
            <div className="filters flex flex-col md:flex-row gap-5 absolute right-0 md:right-[20px] z-10">
                {/* 时间范围选择器 */}
                <Select
                    value={dateRange}
                    onChange={(e: DateRange) => setDateRange(e)}
                    options={[
                        { label: '当天', value: 'today' },
                        { label: '本周', value: 'week' },
                        { label: '本月', value: 'month' },
                        { label: '本年', value: 'year' },
                    ]}
                />
                {/* 事件类型选择器 */}
                <Select
                    value={eventType}
                    style={{ width: 100 }}
                    onChange={(e) => setEventType(e)}
                    options={optionList.current}
                    showSearch
                    placeholder="Select a event"
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />
                {/* 图表类型选择器 */}
                <Select
                    value={chartType}
                    style={{ width: 100 }}
                    onChange={(e) => setChartType(e)}
                    options={[
                        { label: '折线图', value: 'line' },
                        { label: '散点图', value: 'scatter' },
                    ]}
                    showSearch
                    placeholder="Select a chart type"
                />
            </div>
            <div className="EventChart w-full h-full"></div>
        </div>
    );
}

export default EventPUV;