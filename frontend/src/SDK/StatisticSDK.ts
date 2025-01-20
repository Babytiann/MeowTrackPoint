import  axios from "axios";

declare type query ={
    uuid?: string;
    event?: string;
    time?: PerformanceEntry[];
    message?: string;
    stack?: string;
    type?: string;
    page_url?: string;
    FP?: number,
    DCL?: number,
    L?: number,
}
/*路由： /timing 接收时间
        /error  接收错误信息
        /demo  接收用户行为数据
*/
class StatisticSDK{
    uuid: string;

    constructor(UUID: string) {
        this.uuid = UUID;
        this.initPerformance();
        this.initError();
        this.PUV();
    };

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
                console.error("请求出错啦！！！", err);
            })
    }

    //事件监控
    event(key: string, val = {}){
        const eventURL = '/demo';
        this.send(eventURL,{event: key, ...val});
    }

    //PV和UV一起监控，放在一张表格中
    PUV(){
        this.event("puv", {uuid: this.uuid})
    }

    //性能监控
    initPerformance(){
        const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const timeParams: query = { FP: 0, DCL: 0, L: 0 };

        if (navigationEntry) {
            // 页面首次渲染时间 FP
            const fp = navigationEntry.domInteractive - navigationEntry.startTime;
            console.log('FP (First Paint):', fp);

            // DOM 加载完成时间 DCL
            const dcl = navigationEntry.domContentLoadedEventEnd - navigationEntry.startTime;
            console.log('DCL (DOM Content Loaded):', dcl);

            // 外链资源加载完成时间 L
            const loadTime = navigationEntry.loadEventEnd - navigationEntry.startTime;
            console.log('L (Load):', loadTime);

            timeParams.FP = fp;
            timeParams.DCL = dcl;
            timeParams.L = loadTime;

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

        this.send(errorURL, {...transform})
    }

    initError(){
        window.addEventListener('error', event=>{
            this.error(event.error, { type: 'errorEvent'});
        })
        window.addEventListener('unhandledrejection', event=>{
            this.error(new Error(event.reason), { type: 'unhandledrejection'})  //query中添加type属性
        })
    }

}

export default StatisticSDK;