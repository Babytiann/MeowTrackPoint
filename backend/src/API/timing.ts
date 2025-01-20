import express, { Request, Response } from "express";
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.development.local' });

// 使用 async 函数创建数据库连接
async function initDatabase() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
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
            'FP BIGINT, ' +
            'DCL BIGINT, ' +
            'L BIGINT, ' +
            'create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');

        console.log("Table 'timing' is ready.");
    } catch (error) {
        console.error("create or connect table error", error);
    } finally {
        try {
            await conn.end();  // 确保数据库连接正常关闭
        } catch (closeError) {
            console.error("Error closing connection:", closeError);
        }
    }
}

// 使用 async 函数创建数据库连接
async function insertData(data: unknown) {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    const { uuid, event, pageUrl, FP, DCL, L} = data as {
        uuid?: string;
        event?: string;
        pageUrl?: string;
        FP?: number;
        DCL?: number;
        L?: number;
    };

    try {
        // 调整后的 SQL 插入语句
        const sql = 'INSERT INTO timing (uuid, event, pageUrl, FP, DCL, L) VALUES (?, ?, ?, ?, ?, ?)';
        const val = [
            uuid,
            event,
            pageUrl,
            FP,
            DCL,
            L,
        ];

        const [result, fields] = await conn.execute(sql, val);

        console.log(result);
        console.log(fields);
    } catch (error) {
        console.error("Error inserting data:", error);
    } finally {
        try {
            await conn.end();  // 确保数据库连接正常关闭
        } catch (closeError) {
            console.error("Error closing connection:", closeError);
        }
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
            res.status(200).json({ message: "Data sent to timing successfully" });
        } catch (error) {
            console.error("Data insertion failed", error);
            res.status(500).json({ message: "Error inserting data" });
        }
    });

export default router;
