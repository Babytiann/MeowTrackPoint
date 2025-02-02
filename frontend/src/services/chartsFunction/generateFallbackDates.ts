//此函数用于生成日期范围的默认日期，例如今天、本周、本月、本年，如果不生成，则会导致当数据库没有当前时间范围的数据的时候直接不展示图表，
//因为X轴没有日期数据

function generateFallbackDates(range: DateRange): string[] {
    const today = new Date();
    switch (range) {
        case 'today': {
            return [today.toISOString().split('T')[0]];
        }
        case 'week': {
            return Array.from({ length: 7 }, (_, i) => {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                return d.toISOString().split('T')[0];
            }).reverse();
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