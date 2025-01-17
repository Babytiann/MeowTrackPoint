import  axios from "axios";

declare type query ={
    uuid?: string;
    event?: string;
    time?: PerformanceEntry[];
    message?: string;
    stack?: string;
    type?: string;
    page_url?: string;
}
/*路由： /timing 接收时间
        /error  接收错误信息
        /demo  接收用户行为数据
*/
class StatisticSDK{
    uuid: string;
    navigationEntries = performance.getEntriesByType('navigation');

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
        if (this.navigationEntries.length > 0){
            const url:string = '/timing';
            this.send(url,{time: this.navigationEntries});
        }
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
            this.error(event.error);
        })
        window.addEventListener('unhandledrejection', event=>{
            this.error(new Error(event.reason), { type: 'unhandledrejection'})  //query中添加type属性
        })
    }

}

export default StatisticSDK;