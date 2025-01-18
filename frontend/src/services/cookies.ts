function cookies(uuid: string, days: number = 7) {

    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // 计算过期时间，getTime把时间变成毫秒，加上后面的推迟时间之后又用setTime变成推迟后的时间也就是，年月日小时分钟秒
    const expires = "expires=" + date.toUTCString(); // 格式化过期时间，e.g.Mon, 18 Feb 2025 12:00:00 GMT

    document.cookie = `uuid=${encodeURIComponent(uuid)}; ${expires}; path=/`;
}

export default cookies;
