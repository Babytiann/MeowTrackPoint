type DateRange = 'today' | 'week' | 'month' | 'year';

function getDateRange(range: DateRange){
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
}

export default getDateRange;