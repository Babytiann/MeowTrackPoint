import express, { Request, Response } from "express";
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.development.local' });

// 使用 async 函数创建数据库连接
async function initDatabase() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        await conn.query('create table if not exists timing (' +
            'id INT primary key auto_increment, ' +
            'uuid varchar(255), ' +
            'event varchar(10), ' +
            'pageUrl varchar(255), ' +
            'navigationStart BIGINT, ' +
            'domLoading BIGINT, ' +
            'domLoadDone BIGINT, ' +
            'Loadend BIGINT' +
            'create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');

        console.log("Table 'timing' is ready.");
    } catch (error) {
        console.error("create or connect table error", error);
    } finally {
        await conn.end();  // 关闭连接
    }
}

// 使用 async 函数创建数据库连接
async function insertData(data: unknown) {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    const { uuid, event, pageUrl, navigationStart, domLoading, domLoadDone, Loadend } = data as {
        uuid?: string;
        event?: string;
        pageUrl?: string;
        navigationStart?: number;
        domLoading?: number;
        domLoadDone?: number;
        Loadend?: number;
    };

    try {
        const sql = 'insert into timing (uuid, event, pageUrl, navigationStart, domLoading, domLoadDone, Loadend) values(?, ?, ?, ?, ?, ?, ?)';
        const val = [uuid, event, pageUrl, navigationStart, domLoading, domLoadDone, Loadend];

        const [result, fields] = await conn.execute(sql, val);

        console.log(result);
        console.log(fields);
    } catch (error) {
        console.error("Error inserting data:", error);
    } finally {
        await conn.end();
    }
}

// 执行数据库初始化
initDatabase().catch(error => console.error(error));

const router = express.Router();

router
    .get("/", (_, res: Response) => {
        res.json("This is the timing API");
    })
    .post("/", async (req: Request, res: Response) => {
        try {
            const data = req.body;
            await insertData(data);
            res.status(201).json({ message: "Data sent to timing successfully" });
        } catch (error) {
            console.error("Data insertion failed", error);
            res.status(500).json({ message: "Error inserting data" });
        }
    });

export default router;
