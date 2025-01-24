import * as echarts from 'echarts';
import {useEffect} from "react";


function Home() {
    useEffect(() => {
        const chartElement = document.querySelector('.chart') as HTMLDivElement;

        const data = [
            ['product', '2015', '2016', '2017'],
            ['Matcha Latte', 43.3, 85.8, 93.7],
            ['Milk Tea', 83.1, 73.4, 55.1],
            ['Cheese Cocoa', 86.4, 65.2, 82.5],
            ['Walnut Brownie', 72.4, 53.9, 39.1]
        ];

        if (chartElement) {
            const chart = echarts.init(chartElement);
            const option = {
                tooltip: {},
                legend: {},

                dataset: {
                    // 提供一份数据。
                    source: data
                },
                // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
                xAxis: { type: 'category' },
                // 声明一个 Y 轴，数值轴。
                yAxis: {},
                // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
                series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
            };

            chart.setOption(option);

            window.addEventListener('resize', function() {
                chart.resize();
            });

            return () => {
                chart.dispose();
            };
        }
    }, []); // 空依赖数组，确保只在组件挂载时执行

    return (
        <div className="flex flex-col md:flex-row mt-[5%] h-full">
            <div className="chart w-full h-[50%]"></div>
            <div className="chart w-full h-[50%]"></div>
        </div>
    )
}

export default Home;