import * as echarts from 'echarts';
import fetchData from "../../../../SDK/fetchData.ts";
import processData from "../../../../SDK/processData.ts";
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

        if (filteredData.length === 0) return;

        // 生成完整时间段列表（从startDate到currentDate每小时）
        const allDates: string[] = [];
        const currentHour = new Date(startDate.getTime());

        while (currentHour <= currentDate) {
            const year = currentHour.getFullYear();
            const month = String(currentHour.getMonth() + 1).padStart(2, '0');
            const day = String(currentHour.getDate()).padStart(2, '0');
            const hour = String(currentHour.getHours()).padStart(2, '0');
            allDates.push(`${year}-${month}-${day} ${hour}`);
            currentHour.setHours(currentHour.getHours() + 1);
        }

        const { pvData, uvData } = processData(filteredData);

        const pvValues = allDates.map(date => pvData[date] || 0);
        const uvValues = allDates.map(date => uvData[date]?.size || 0);

        const chart = echarts.init(chartElement);
        const option = {
            title: { text: '首页PV & UV 数据', left: 'center' },
            tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
            legend: { data: ['PV', 'UV'], left: 'left' },
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

export default Home;