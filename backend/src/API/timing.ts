import express, { Request, Response } from "express";
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';


dotenv.config({ path: '.env.development.local' });
async function insertData(data: unknown) {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    await conn.query('create table if not exists timing (' +
        'id INT primary key auto_increment, ' +
        'uuid varchar(255), ' +
        'event varchar(10), ' +
        'pageUrl varchar(255), ' +
        'navigationStart BIGINT, ' +
        'domLoading BIGINT, ' +
        'domLoadDone BIGINT, ' +
        'Loadend BIGINT) ');
}

const router = express.Router();

router
    .get("/", (_, res: Response) => {
        res.json("This is the timing API")
    })
    .post("/", (req: Request, res: Response) => {
        // 获取请求体内容
        const { name, age } = req.body;
        console.log(name, age); // 打印请求体中的数据
        res.json("111")
    })


export default router;
