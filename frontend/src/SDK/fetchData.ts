import axios from "axios";

async function fetchData() {
    try {
        const [demoRes, errorRes, timingRes, baseInfoRes] = await Promise.all([
            axios.post('http://localhost:5927/check', { table: "demo" }),
            axios.post('http://localhost:5927/check', { table: "error" }),
            axios.post('http://localhost:5927/check', { table: "timing" }),
            axios.post('http://localhost:5927/check', { table: "baseInfo" })
        ]);

        return {
            demoData: demoRes.data,
            errorData: errorRes.data,
            timingData: timingRes.data,
            baseInfoData: baseInfoRes.data
        };
    } catch (error) {
        console.error("fetchData中获取数据失败", error);
        return {};
    }
}

export default fetchData;
