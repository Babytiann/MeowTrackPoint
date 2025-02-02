import getDateRange from "./getDateRange.ts";

function processDate(chartData: TableData | null, dateRange: DateRange ){
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

    return {filteredData, allDates}
}

export default processDate;