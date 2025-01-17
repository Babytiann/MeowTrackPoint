import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors'

import demo from "./router/demo";
import timing from "./router/timing";
import error from './router/error'

//后端初始化路由
const app = express();

//CORS跨域, some是遍历数组的一种方法
const corsOptions= {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow: boolean) => void) {
        const allowedOrigins = [
            'http://localhost:5173',
            /^https:\/\/([a-zA-Z0-9-]*\.)?gemdzqq\.com$/,
        ];
        // 如果没有 origin 头部（通常是后端自己发起请求），直接允许，后端自己发出的请求都是undefined，你可以console.log一下，如果不这么设置，你会发现你在浏览器直接输入localhost是错误的
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.some(pattern => pattern instanceof RegExp ? pattern.test(origin) : pattern === origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

// 全局使用 body-parser 中间件来解析请求体
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Router引入
app.use('/demo', demo);
app.use("/timing", timing);
app.use('/error', error);

//后端直接配置路由
app.get('/', (req, res) => {
    res.send('Welcome to Meow Backend !✨');
});


//监听端口
const port = 5927
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
