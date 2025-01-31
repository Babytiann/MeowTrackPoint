import * as echarts from 'echarts';
import fetchData from "../../../../services/fetchData.ts";
import processData from "../../../../services/frontendFunction/processData.ts";
import processDate from "../../../../services/frontendFunction/processDate.ts";
import generateFallbackDates from "../../../../services/frontendFunction/generateFallbackDates.ts";

import { useEffect, useState } from "react";
import { Select } from 'antd';

function PUV() {
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [dateRange, setDateRange] = useState<DateRange>('week');  // 默认选中“本周”

    useEffect(() => {
        fetchData().then((res) => {
            setChartData(res);
        });
    }, []);

    useEffect(() => {
        const chartElement = document.querySelector('.chart') as HTMLDivElement;

        // 获取日期范围和过滤后的数据（即使为空数组）
        const { filteredData = [], allDates = [] } = processDate(chartData, dateRange) || {};

        // 如果allDates为空（发生在完全没有数据时），手动生成日期范围
        const safeDates = allDates.length > 0
            ? allDates
            : generateFallbackDates(dateRange);

        // 处理数据（兼容空数组）
        const { pvData, uvData } = processData(filteredData, "puv");

        // 确保每个日期都有值
        const pvValues = safeDates.map(date => pvData[date] || 0);
        const uvValues = safeDates.map(date => (uvData[date] ? uvData[date].size : 0));

        // 渲染图表
        const chart = echarts.init(chartElement, 'chalk');
        const option = {
            title: { text: '首页PV & UV ', left: 'center' },
            tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
            legend: { data: ['PV', 'UV'], left: 'left', orient: "vertical", itemGap: 20 },
            xAxis: { type: 'category', data: safeDates },
            yAxis: { type: 'value' },
            dataZoom: [
                { type: 'slider', start: 0, end: 100, xAxisIndex: [0] },
                { type: 'inside', xAxisIndex: [0] },
                { type: 'inside', yAxisIndex: [0] }
            ],
            series: [
                { name: 'PV', type: 'line', data: pvValues },
                { name: 'UV', type: 'line', data: uvValues }
            ]
        };

        chart.setOption(option);
        const resizeHandler = () => chart.resize();
        window.addEventListener('resize', resizeHandler);

        return () => {
            window.removeEventListener('resize', resizeHandler);
            chart.dispose();
        };
    }, [chartData, dateRange]);

    return (
        <div className="w-full h-full relative">
            <div className="filters absolute right-[20px] z-10">
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
            </div>
            <div className="chart w-full h-full"></div>
        </div>
    );
}

export default PUV;