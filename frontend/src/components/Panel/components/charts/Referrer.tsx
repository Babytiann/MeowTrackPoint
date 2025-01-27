import * as echarts from 'echarts';
import fetchData from "../../../../services/fetchData.ts";
import processData from "../../../../services/processData.ts";
import { useEffect, useState } from "react";

// 定义返回的数据结构类型
interface ChartData {
    demoData?: Array<{ uuid: string; create_at: string; event: string; event_data: string; page_url: string }> ;
    errorData?: unknown;
    timingData?: Array<{ uuid: string; create_at: string; event: string; page_url: string; FP: number; DCL: number; L: number }> ;
    baseInfoData?: Array<{ uuid: string; create_at: string; browser: string; os: string; referrer: string; }> ;
}

function PiePUV() {
    const [chartData, setChartData] = useState<ChartData | null>(null);

    useEffect(() => {
        fetchData().then((res) => {
            setChartData(res);
        });
    }, []);

    useEffect(() => {
        const chartElement = document.querySelector('.ReferrerChart') as HTMLDivElement;

        // 获取当前时间，作为结束时间
        const currentDate = new Date();
        currentDate.setSeconds(0, 0);  // 重置秒和毫秒为 0

        // 确保 demoData 是数组类型
        const demoData = chartData?.demoData as Array<{ create_at: string; event: string; uuid: string; page_url: string }>;


        if (demoData) {

            // 统计 PV 和 UV
            const { pvData, uvData } = processData(demoData, "puv");

            // 计算 PV 和 UV 总数
            const totalPv = Object.values(pvData).reduce((acc, pv) => acc + pv, 0);
            const totalUv = Object.values(uvData).reduce((acc, uv) => acc + uv.size, 0);

            // 准备饼图数据
            const pieData = [
                { value: totalPv, name: 'PV' },
                { value: totalUv, name: 'UV' },
            ];

            if (chartElement) {
                const chart = echarts.init(chartElement);
                const option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)',  // 提示框格式
                    },
                    legend: {
                        data: ['PV', 'UV'],
                    },
                    series: [
                        {
                            name: 'visitor Source',
                            type: 'pie',
                            radius: '50%',
                            data: pieData,
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowOffsetY: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.2)',
                                },
                            },
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
        <div className="ReferrerChart w-full h-full"></div>
    )
}

export default PiePUV;
