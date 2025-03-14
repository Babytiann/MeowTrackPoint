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
        await conn.query('CREATE TABLE IF NOT EXISTS error (' +
            'id INT PRIMARY KEY AUTO_INCREMENT, ' +
            'uuid VARCHAR(255), ' +
            'message TEXT, ' +
            'stack TEXT, ' +
            'type VARCHAR(50), ' +
            'page_url VARCHAR(255), ' +
            'create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');

        console.log("Table 'error' is ready.");
    } catch (error) {
        console.error("create or connect table 'error' error", error);
    } finally {
        try {
            await conn.end();  // 确保数据库连接正常关闭
        } catch (closeError) {
            console.error("Error closing connection:", closeError);
        }
    }
}

// 使用 async 函数插入数据
async function insertData(data: unknown) {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    const { uuid, message, stack, type, page_url } = data as {
        uuid?: string;
        message?: string;
        stack?: string;
        type?: string;
        page_url?: string;
    };

    try {
        const sql = 'INSERT INTO error (uuid, message, stack, type, page_url) VALUES(?, ?, ?, ?, ?)';
        const val = [uuid, message, stack, type, page_url];

        const [result, fields] = await conn.execute(sql, val);

        console.log(result);
        console.log(fields);
        console.log("Insert in table 'error'\n");
    } catch (error) {
        console.error("Error inserting data in table 'error':", error);
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
        res.json("This is the error logging API");
    })
    .post("/", async (req: Request, res: Response) => {
        try {
            const data = req.body;
            await insertData(data);
            res.status(200).json({ message: "Error data logged successfully" });
        } catch (error) {
            console.error("Data insert to table 'error' failed", error);
            res.status(500).json({ message: "Error inserting data" });
        }
    });

export default router;
