import express, {Response, Request} from "express";
import mysql from "mysql2/promise";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.development.local' });

async function checkData(table: string, res: Response) {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    })

    try {
        const sql = `SELECT * FROM ${table}`;
        const [rows] = await conn.execute(sql);  // rows 是包含查询结果的数组
        res.json(rows);  // 返回查询结果，Express 会自动将其转成 JSON 格式

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Query data in ${table} failed` });

    } finally {
        try {
            await conn.end();  // 确保数据库连接正常关闭
        } catch (closeError) {
            console.error("Error closing connection:", closeError);
        }
    }
}

const router = express.Router();

router
    .post("/",async (req: Request, res: Response)=> {
        const table = req.body.table;

        if (!table) {
            res.status(400).json({ error: "Table name is required" });
        }

        await checkData(table, res);
    })

export default router;