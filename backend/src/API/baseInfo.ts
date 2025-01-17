import express, { Request, Response } from "express";
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';


dotenv.config({ path: '.env.development.local' });
// 使用 async 函数创建数据库连接
async function insertData(data: unknown) {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    await conn.query('create table if not exists baseInfo (' +
        'id int primary key auto_increment,' +
        'uuid varchar(255),' +
        'browser varchar(20),' +
        'os varchar(20),' +
        'referrer varchar(255)'); //referrer是来源网址，前端通过document.referrer 获取
}

const router = express.Router();

router
    .get("/", (_, res: Response) => {
        res.json("This is the baseInfo API")
    })
    .post("/", (req: Request, res: Response) => {
        // 获取请求体内容
        const { name, age } = req.body;
        console.log(name, age); // 打印请求体中的数据
    });

export default router;