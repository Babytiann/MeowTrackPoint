import  axios from "axios";

declare type query ={
    uuid?: string;
    event?: string;
}

class StatisticSDK{
    uuid: string;
    navigationEntries = performance.getEntriesByType('navigation');

    constructor(UUID: string) {
        this.uuid = UUID;
    }

    send(Url: string, query: query= {}){
        query.uuid = this.uuid;                             //添加事件名称

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

    event(key: string, val = {}){
        const eventURL = '/demo';
        this.send(eventURL,{event:key, ...val});
    }

    pv(){
        this.event("pv")
    }  //返回页面访问次数，请求发送一次说明产生一次访问

    UV(){
        this.event("uv", {uuid: this.uuid})
    }


}

export default StatisticSDK;