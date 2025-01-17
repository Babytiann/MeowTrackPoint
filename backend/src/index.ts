import express from 'express';
import book from './router/error'
import cors from 'cors'

//后端初始化路由
const app = express();
const port = 5927

//CORS跨域, some是遍历数组的一种方法
const corsOptions= {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow: boolean) => void) {
        const allowedOrigins = [
            'http://localhost:5173',
            'https://localhost:5173',
            /^https:\/\/([a-zA-Z0-9-]*\.)?gemdzqq\.com$/,
        ];

        if (origin && allowedOrigins.some(pattern => pattern instanceof RegExp ? pattern.test(origin) : pattern === origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions)); //返回如果是

//Router引入
app.use('/book', book)

//后端直接配置路由
app.get('/', (req, res) => {
    res.send('Welcome to Meow Backend !✨');
});

app.get('/baby', (req, res) => {
    res.status(200).json('route baby')
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
