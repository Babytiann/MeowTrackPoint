import * as echarts from 'echarts';
import fetchData from "../../../../services/fetchData.ts";
import processData from "../../../../services/processData.ts";
import processDate from "../../../../services/processDate.ts";
import { useEffect, useState, useRef } from "react";
import { Select } from 'antd';

// 定义返回的数据结构类型
interface ChartData {
    demoData?: Array<{ uuid: string; create_at: string; event: string; event_data: string; page_url: string }> ;
    errorData?: unknown;
    timingData?: Array<{ uuid: string; create_at: string; event: string; page_url: string; FP: number; DCL: number; L: number }> ;
    baseInfoData?: Array<{ uuid: string; create_at: string; browser: string; os: string; referrer: string; }> ;
}

interface SeriesData {
    name: string;
    type: 'line';
    data: number[];
}

type DateRange = 'today' | 'week' | 'month' | 'year';

function EventPUV() {
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [dateRange, setDateRange] = useState<DateRange>('week');  // 默认选中“当天”
    const [eventType, setEventType] = useState<string>('total');
    const optionList = useRef<{ label: string; value: string }[]>([]); // 使用 useRef 来存储 optionList

    useEffect(() => {
        fetchData().then((res) => {
            setChartData(res);
            console.log(res)
        });
    }, []);

    useEffect(() => {
        const chartElement = document.querySelector('.EventChart') as HTMLDivElement;

        if (!chartData) return;

        // 使用可选链来避免手动判断 null 或 undefined
        const { filteredData, allDates } = processDate(chartData, dateRange) ?? {};

        // 如果 filteredData 或 allDates 为 undefined，提前返回
        if (!filteredData?.length || !allDates) return;


        // 更新 optionList 数据
        optionList.current = Array.from(
            new Set(
                chartData.demoData
                    ?.filter(item => item.event !== 'puv') // 过滤掉 event 为 'puv' 的项
                    .map(item => item.event)
            )
        ).map(event => ({
            label: event,
            value: event
        }));

        optionList.current.push({ label: 'total', value: 'total' });


        // 为选择的事件类型生成数据
        const series: SeriesData[] = [];
        if (eventType === 'total') {
            // 如果选择了 'total'，遍历所有事件
            optionList.current.forEach((option) => {
                if (option.value === 'total') return; // 跳过 'total' 选项本身
                const { pvData, uvData } = processData(filteredData, option.value);

                const pvValues = allDates.map(date => pvData[date] || 0);
                const uvValues = allDates.map(date => uvData[date]?.size || 0);

                series.push(
                    { name: `${option.value} PV`, type: 'line', data: pvValues },
                    { name: `${option.value} UV`, type: 'line', data: uvValues }
                );
            });
        } else {
            // 如果选择了某一特定事件类型
            const { pvData, uvData } = processData(filteredData, eventType);

             const pvValues = allDates.map(date => pvData[date] || 0);
             const uvValues = allDates.map(date => uvData[date]?.size || 0);

            series.push(
                { name: `${eventType} PV`, type: 'line', data: pvValues },
                { name: `${eventType} UV`, type: 'line', data: uvValues }
            );
        }

        const chart = echarts.init(chartElement);
        const option = {
            title: { text: '事件PV & UV', left: 'center' },
            tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
            legend: {
                data: series.map(item => item.name),
                left: 'left',
                orient: "vertical",
                itemGap: 20
            },
            xAxis: {
                type: 'category',
                data: allDates
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

        chart.setOption(option);
        const resizeHandler = () => chart.resize();
        window.addEventListener('resize', resizeHandler);

        return () => {
            window.removeEventListener('resize', resizeHandler);
            chart.dispose();
        };
    }, [chartData, dateRange, eventType]);

    return (
        <div className="w-full h-full relative">
            <div className="filters flex flex-col md:flex-row gap-5 absolute right-0 md:right-[20px] z-10">
                <Select
                    value={dateRange}
                    onChange={(e) => setDateRange(e as DateRange)}
                    options={[
                        { label: '当天', value: 'today' },
                        { label: '本周', value: 'week' },
                        { label: '本月', value: 'month' },
                        { label: '本年', value: 'year' },]}
                />
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
            </div>
            <div className="EventChart w-full h-full"></div>
        </div>
    );
}

export default EventPUV;