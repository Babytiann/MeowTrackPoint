import * as echarts from 'echarts';
import fetchData from "../../../../services/fetchData.ts";
import processDate from "../../../../services/chartsFunction/processDate.ts";
import generateFallbackDates from "../../../../services/chartsFunction/generateFallbackDates.ts";

import { useEffect, useState, useRef } from "react";
import { Select } from 'antd';

function Timing({ events }: Readonly<HomeProps>) {
    const [chartData, setChartData] = useState<TableData | null>(null);
    const [dateRange, setDateRange] = useState<DateRange>('week');  // 默认选中“本周”
    const chartInstance = useRef<echarts.ECharts | null>(null);

    useEffect(() => {
        fetchData().then((res) => {
            setChartData(res);
        });
    }, []);

    // 处理图表渲染
    useEffect(() => {
        const chartElement = document.querySelector('.TimingChart') as HTMLDivElement;
        if (!chartElement || !chartData) return;

        // 使用 chartData.timingData 获取数据
        const { filteredData = [], allDates = [] } = processDate(chartData.timingData, dateRange) || {};

        // 强制生成日期范围（兼容空数据）
        const safeDates = allDates.length > 0 ? allDates : generateFallbackDates(dateRange);

        // 初始化数据结构
        const fpData: Array<{ date: string, time: Array<number> }> = [];
        const dclData: Array<{ date: string, time: Array<number> }> = [];
        const lData: Array<{ date: string, time: Array<number> }> = [];

        filteredData.forEach((item) => {
            const date = item.create_at.slice(0, 13);  // 取出年月日时
            const fp = item.FP ?? 0;
            const dcl = item.DCL ?? 0;
            const l = item.L ?? 0;

            // 每个日期的FP、DCL、L都保存为一个数组
            const fpIndex = fpData.findIndex((data) => data.date === date);
            const dclIndex = dclData.findIndex((data) => data.date === date);
            const lIndex = lData.findIndex((data) => data.date === date);

            if (fpIndex === -1) {
                fpData.push({ date, time: [fp] });
            } else {
                fpData[fpIndex].time.push(fp);
            }

            if (dclIndex === -1) {
                dclData.push({ date, time: [dcl] });
            } else {
                dclData[dclIndex].time.push(dcl);
            }

            if (lIndex === -1) {
                lData.push({ date, time: [l] });
            } else {
                lData[lIndex].time.push(l);
            }
        });

        // 提取并排序数据，避免直接修改原数组
        const getSortedTimeData = (time: number[]) => {
            const sortedTime = [...time]; // 创建副本
            sortedTime.sort((a, b) => a - b); // 排序
            return sortedTime;
        };

        // 构建箱型图所需的数据格式
        const series = [
            {
                name: 'FP',
                type: 'boxplot',
                data: fpData.map(item => [
                    Math.min(...item.time),  // 最小值
                    ...getSortedTimeData(item.time).slice(Math.floor(item.time.length * 0.25), Math.floor(item.time.length * 0.75)), // 四分位数
                    Math.max(...item.time),  // 最大值
                ]),
            },
            {
                name: 'DCL',
                type: 'boxplot',
                data: dclData.map(item => [
                    Math.min(...item.time),
                    ...getSortedTimeData(item.time).slice(Math.floor(item.time.length * 0.25), Math.floor(item.time.length * 0.75)),
                    Math.max(...item.time),
                ]),
            },
            {
                name: 'L',
                type: 'boxplot',
                data: lData.map(item => [
                    Math.min(...item.time),
                    ...getSortedTimeData(item.time).slice(Math.floor(item.time.length * 0.25), Math.floor(item.time.length * 0.75)),
                    Math.max(...item.time),
                ]),
            },
        ];

        // 初始化或更新图表
        if (!chartInstance.current) {
            chartInstance.current = echarts.init(chartElement, 'chalk');
        }

        const option = {
            title: {
                text: '用户访问性能（箱型图）',
                left: 'center',
                textStyle: {
                    color: '#333',
                },
            },
            tooltip: {
                trigger: "item",
                axisPointer: { type: "shadow" }
            },
            legend: {
                data: ['FP', 'DCL', 'L'],
                left: 'left',
                orient: "vertical",
                itemGap: 20
            },
            xAxis: {
                type: 'category',
                data: safeDates, // 使用 safeDates 作为 X 轴数据
            },
            yAxis: {
                type: 'value',
                name: '时间 (ms)',
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
    }, [chartData, dateRange, events]);

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
            </div>
            <div className="TimingChart w-full h-full"></div>
        </div>
    );
}

export default Timing;
