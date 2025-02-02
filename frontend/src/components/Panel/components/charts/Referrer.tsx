import * as echarts from 'echarts';
import fetchData from "../../../../services/fetchData.ts";
import { useEffect, useState } from "react";


function RoseChart() {
    const [chartData, setChartData] = useState<TableData | null>(null);

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

        // 确保 baseInfoData 是数组类型
        const baseInfoData = chartData?.baseInfoData as Array<{ create_at: string; referrer: string; uuid: string }>;


        if (baseInfoData) {
            // 用一个 Map 来存储每个用户唯一的来源
            const userSourceMap = new Map<string, string>();

            baseInfoData.forEach((item) => {
                if (item.referrer && (!userSourceMap.has(item.uuid) || userSourceMap.get(item.uuid) !== item.referrer)) {
                    userSourceMap.set(item.uuid, item.referrer);
                }
            });

            // 根据来源统计每个来源的访问量
            const sourceCount: Record<string, number> = {};

            userSourceMap.forEach((referrer) => {
                if (sourceCount[referrer]) {
                    sourceCount[referrer]++;
                } else {
                    sourceCount[referrer] = 1;
                }
            });

            // 将统计数据转换为饼图需要的数据格式
            const pieData = Object.keys(sourceCount).map((source) => ({
                value: sourceCount[source],
                name: source || 'Unknown',
            }));

            if (chartElement) {
                const chart = echarts.init(chartElement, 'chalk');
                const option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)',  // 提示框格式
                    },
                    series: [
                        {
                            name: 'User Source',
                            type: 'pie',
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
                    roseType: "area", // 玫瑰图
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
    );
}

export default RoseChart;
