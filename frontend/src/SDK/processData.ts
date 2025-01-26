/*
* 此函数就是为了给PUV的两张图表提供PUV数据用的
*/

interface DemoData {
    uuid: string;
    create_at: string;
    event: string;
}

function processData(demoData: DemoData[]) {
    const pvData: { [key: string]: number } = {};
    const uvData: { [key: string]: Set<string> } = {};

    demoData.forEach(item => {
        if (item.event !== 'puv') return; // 只统计 puv 事件

        const dateWithHour = new Date(item.create_at).toISOString().split('T')[0] + ' ' + new Date(item.create_at).getUTCHours().toString().padStart(2, '0');

        pvData[dateWithHour] = (pvData[dateWithHour] || 0) + 1;
        if (!uvData[dateWithHour]) uvData[dateWithHour] = new Set();
        uvData[dateWithHour].add(item.uuid);
    });

    return { pvData, uvData };
}

export default processData;