import axios from "axios";
import { UAParser } from 'ua-parser-js';

declare type query = {
    uuid?: string | null;
    event?: string;
    event_data?: string | null;
    time?: PerformanceEntry[];
    message?: string;
    stack?: string | null;
    type?: string;
    page_url?: string;
    FP?: number;
    DCL?: number;
    L?: number;
    os?: string;
    browser?: string;
    referrer?: string;
}

class StatisticSDK {
    uuid: string | null;

    constructor(UUID: string | null) {
        this.uuid = UUID;
        this.initError();
        this.PUV();
        this.sendBaseInfo();
        this.initPerformance();
        this.monitorWhiteScreen(); // 初始化白屏监控
    }

    send(Url: string, query:query = {}){
        query.uuid = this.uuid;                   //添加事件名称
        query.page_url = window.location.href;      // 获取当前页面 URL

        axios({
            method: 'post',
            baseURL: 'http://localhost:5927',
            url: Url,
            data: query,
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                console.log("Send data successfully:",response.data);
            })
            .catch(err => {
                console.error("SDK中send函数请求出错啦！！！", err);
            })
    }

    //事件监控，PV和UV一起监控，放在一张表格中
    PUV(){
        this.send('/demo',{event: "puv", event_data: null})
    }

    //性能监控
    initPerformance(){
        const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const timeParams: query = { FP: 0, DCL: 0, L: 0 };

        if (navigationEntry) {
            // 页面首次渲染时间 FP
            const fp = navigationEntry.domInteractive - navigationEntry.startTime;

            // DOM 加载完成时间 DCL
            const dcl = navigationEntry.domContentLoadedEventEnd - navigationEntry.startTime;

            // 外链资源加载完成时间 L
            const loadTime = navigationEntry.loadEventEnd - navigationEntry.startTime;

            timeParams.FP = fp;
            timeParams.DCL = dcl;
            timeParams.L = loadTime;
            timeParams.event = "send Timing";

        } else {
            console.log('No navigation entry found.');
        }

        this.send("/timing", timeParams)

    };

    //错误处理
    error(err: Error, etraInfo:Record<string, unknown> = {}) {
        const errorURL = '/error';
        const { message, stack } = err;

        const transform = {
            message: String(message),
            stack: String(stack),
            ...etraInfo // 展开 etraInfo 对象
        };

        this.send(errorURL, { ...transform })
    }

    initError() {
        window.addEventListener('error', event => {
            this.error(event.error, { type: 'errorEvent' });
        })
        window.addEventListener('unhandledrejection', event => {
            this.error(new Error(event.reason), { type: 'unhandledrejection' })  // query中添加type属性
        })
    }

    sendBaseInfo() {
        const userAgent = navigator.userAgent;
        const parser = new UAParser(userAgent);

        const os = parser.getOS().name; // 获取操作系统信息
        const osVersion = parser.getOS().version; // 获取操作系统版本信息
        const browser = parser.getBrowser();
        const browserName = browser.name; // 获取浏览器名称
        const browserVersion = browser.version; // 获取浏览器版本号
        const referrer = document.referrer;

        const fullOS = os && osVersion ? `${os} ${osVersion}` : os;
        const fullBrowserInfo = `${browserName} ${browserVersion}`; // 完整的浏览器信息

        this.send("/baseInfo", { os: fullOS, browser: fullBrowserInfo, referrer: referrer });
    }

    // 白屏监控
    monitorWhiteScreen() {
        const timeoutDuration: number = 5000; // 5秒内没有内容则认为是白屏
        const checkInterval: number = 1000; // 每秒检查一次

        const checkContent = (): boolean => {
            return document.body.innerHTML.trim().length > 0;
        }

        // 定期检查是否发生白屏
        const timer = setInterval(() => {
            if (!checkContent()) {
                console.warn("白屏检测: 页面在5秒内没有内容渲染");
                this.send('/error', {
                    type: "whiteScreen",
                    message: "Page did not load content within 5 seconds",
                    stack: null
                });
                clearInterval(timer); // 停止检查
            } else {
                console.log("页面已正常渲染");
                clearInterval(timer); // 停止检查
            }
        }, checkInterval);

        // 设置5秒超时后强制停止检测
        setTimeout(() => {
            clearInterval(timer);
        }, timeoutDuration);
    }
}

export default StatisticSDK;