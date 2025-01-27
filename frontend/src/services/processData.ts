interface DemoData {
    uuid: string;
    create_at: string;
    event: string;
}

function processData(demoData: DemoData[], type: string) {
    const pvData: { [key: string]: number } = {};
    const uvData: { [key: string]: Set<string> } = {};

    // 过滤出需要的事件


    demoData.forEach(item => {
        // 只处理指定类型的事件
        if (item.event !== type) return;

        const dateWithHour = new Date(item.create_at).toISOString().split('T')[0] + ' ' + new Date(item.create_at).getUTCHours().toString().padStart(2, '0');

        // 更新 pvData
        pvData[dateWithHour] = (pvData[dateWithHour] || 0) + 1;

        // 更新 uvData
        if (!uvData[dateWithHour]) uvData[dateWithHour] = new Set();
        uvData[dateWithHour].add(item.uuid);
    });

    return { pvData, uvData };
}

export default processData;