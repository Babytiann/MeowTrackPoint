import * as echarts from 'echarts';
import fetchData from "../../../../services/fetchData.ts";
import processData from "../../../../services/processData.ts";
import processDate from "../../../../services/processDate.ts";
import { useEffect, useState } from "react";
import { Select } from 'antd';

// 定义返回的数据结构类型
interface ChartData {
    demoData?: Array<{ uuid: string; create_at: string; event: string; event_data: string; page_url: string }> ;
    errorData?: unknown;
    timingData?: Array<{ uuid: string; create_at: string; event: string; page_url: string; FP: number; DCL: number; L: number }> ;
    baseInfoData?: Array<{ uuid: string; create_at: string; browser: string; os: string; referrer: string; }> ;
}

type DateRange = 'today' | 'week' | 'month' | 'year';

function PUV() {
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [dateRange, setDateRange] = useState<DateRange>('week');  // 默认选中“当天”

    useEffect(() => {
        fetchData().then((res) => {
            setChartData(res);
        });
    }, []);

    useEffect(() => {
        const chartElement = document.querySelector('.chart') as HTMLDivElement;

        if (!chartData) return;

        // 使用可选链来避免手动判断 null 或 undefined
        const { filteredData, allDates } = processDate(chartData, dateRange) ?? {};

        // 如果 filteredData 或 allDates 为 undefined，提前返回
        if (!filteredData?.length || !allDates) return;

        const { pvData, uvData } = processData(filteredData, "puv");

        const pvValues = allDates.map((date) => pvData[date] || 0);
        const uvValues = allDates.map((date) => uvData[date]?.size || 0);

        const chart = echarts.init(chartElement);
        const option = {
            title: { text: '首页PV & UV 数据', left: 'center' },
            tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
            legend: { data: ['PV', 'UV'], left: 'left', orient: "vertical", itemGap: 20 },
            xAxis: { type: 'category', data: allDates },
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
                    onChange={(e) => setDateRange(e as DateRange)}
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