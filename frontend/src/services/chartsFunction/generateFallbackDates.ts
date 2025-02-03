//此函数用于生成日期范围的默认日期，例如今天、本周、本月、本年，如果不生成，则会导致当数据库没有当前时间范围的数据的时候直接不展示图表，
//因为X轴没有日期数据

function generateFallbackDates(range: DateRange): string[] {
    const today = new Date();
    switch (range) {
        case 'today': {
            return [today.toISOString().split('T')[0]];
        }
        case 'week': {
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());  // 获取当前周的开始日期（周日）
            return Array.from({ length: 7 }, (_, i) => {
                const d = new Date(weekStart);
                d.setDate(weekStart.getDate() + i+1);  // 向后推算两天，因为周日的getDay()是0
                return d.toISOString().split('T')[0];
            });
        }
        case 'month': {
            const year = today.getFullYear();
            const month = today.getMonth();
            const days = new Date(year, month + 1, 0).getDate();
            return Array.from({ length: days }, (_, i) =>
                `${year}-${(month + 1).toString().padStart(2, '0')}-${(i + 1).toString().padStart(2, '0')}`
            );
        }
        case 'year': {
            return Array.from({ length: 12 }, (_, i) =>
                `${today.getFullYear()}-${(i + 1).toString().padStart(2, '0')}`
            );
        }
        default: {
            return [];
        }
    }
}

export default generateFallbackDates;