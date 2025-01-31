interface DemoData {
    uuid: string;
    create_at: string;
    event: string;
}

function processData(demoData: DemoData[], type: string = "") {
    const pvData: { [key: string]: number } = {};
    const uvData: { [key: string]: Set<string> } = {};

    // 过滤出需要的事件
    demoData.forEach(item => {
        // 只处理指定类型的事件
        if (item.event !== type) return;

        const date = new Date(item.create_at);
        date.setHours(date.getHours() + 8);  // 将时间加 8 小时，我也不知道哪里来的误差，反正加上就对了

        const dateWithHour = date.toISOString().split('T')[0] + ' ' + date.getUTCHours().toString().padStart(2, '0');

        // 更新 pvData
        pvData[dateWithHour] = (pvData[dateWithHour] || 0) + 1;

        // 更新 uvData
        if (!uvData[dateWithHour]) uvData[dateWithHour] = new Set();
        uvData[dateWithHour].add(item.uuid);
    });

    return { pvData, uvData };
}

export default processData;