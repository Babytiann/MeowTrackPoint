import { v4 as uuidv4 } from 'uuid';

export function createUuid( days: number = 7) {   //默认七天之后过期

    const date = new Date();
    const uuid = uuidv4()

    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // 计算过期时间，getTime把时间变成毫秒，加上后面的推迟时间之后又用setTime变成推迟后的时间也就是，年月日小时分钟秒
    const expires = "expires=" + date.toUTCString(); // 格式化过期时间，e.g.Mon, 18 Feb 2025 12:00:00 GMT

    console.log("Cookie expiration time: ",date.toUTCString())
    document.cookie = `uuid=${encodeURIComponent(uuid)}; ${expires}; path=/`; // 设置 cookie
}

export function getUUID(){
    const cookieList = document.cookie.split(";");

    for (const cookie of cookieList) {
        const trimmedCookie = cookie.trim();
        if (trimmedCookie.startsWith('uuid=')) {
            return decodeURIComponent(trimmedCookie.substring(5));
        }
    }

    return null; //说明没找到uuid，cookie出错了
}
