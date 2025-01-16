import express from 'express';
import book from './router/test'
import cors from 'cors'

const app = express();
app.use('/book', book)

const port = 5927
// 中间件 1：打印请求日志
app.use((req, res, next) => {
    console.log(`Request made to: ${req.url}`);
    next();  // 调用下一个中间件
});

// 中间件 2：添加自定义头部
app.use((req, res, next) => {
    res.header("X-Custom-Header", "CustomValue");
    console.log(`Next middle`);
    next();  // 调用下一个中间件
});

app.use(cors()); //返回如果是

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/baby', (req, res) => {
    res.status(200).json('route baby')
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
