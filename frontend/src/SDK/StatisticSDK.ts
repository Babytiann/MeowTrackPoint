declare type query ={
    uuid?: string;
    event?: string;
}

class StatisticSDK{
    uuid: string;

    constructor(UUID: string) {
        this.uuid = UUID;
    }

    send(baseUrl: string, query: query= {}){
        query.uuid = this.uuid;                             //添加事件名称
        const queryList = Object.entries(query)
            .map(([key, value]) => `${key}=${value}`)
            .join('&')

        if (navigator.sendBeacon){
            const jsonData = JSON.stringify(query)
            navigator.sendBeacon(baseUrl, jsonData);       //POST请求
        }
        else{
            const img = new Image();
            img.src = `${baseUrl}?${queryList}`            //GET请求
        }
    }

    event(key: string, val = {}){
        const eventURL = 'http://localhost:5927/demo'
        this.send(eventURL,{event:key, ...val})
    }

}

export default StatisticSDK;