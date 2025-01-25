import express, { Request, Response } from "express";
import mysql from 'mysql2/promise'
import dotenv from 'dotenv';

dotenv.config({ path: '.env.development.local' }); //加载环境变量默认是.env，但是我们这里是.env.development.local，所以要加上path

// 初始化数据库连接
async function initDatabase() {

    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try{
        await conn.query('create table if not exists demo (' +
            'id int primary key auto_increment,' +
            'uuid varchar(255),' +
            'event varchar(10),' +
            'event_data text,' +
            'page_url varchar(225),' +
            'create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');

        console.log("Table 'demo' is ready.");
    }catch (error){
        console.error("create or connect 'demo' table error",error);
    } finally{
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

    const { uuid, event, event_data, page_url } = data as {
        uuid?: string,
        event?: string,
        event_data?: string | null,
        page_url?: string
    }; //因为data的类型是unknown，所以需要断言一下

    try{
        const sql = 'insert into demo (uuid, event, event_data, page_url) values(?, ?, ?, ?)';
        const val = [uuid, event, event_data, page_url];

        const [result, fields] = await conn.execute(sql, val);

        console.log(result);
        console.log(fields);
    } catch (error){
        console.error("Error inserting data in table 'demo':", error);
    }finally {
        try {
            await conn.end();  // 确保数据库连接正常关闭
        } catch (closeError) {
            console.error("Error closing connection:", closeError);
        }
    }
}

initDatabase().catch(error => console.error(error));

const router = express.Router();

router
    .get("/", (_, res: Response) => {
        res.json("This is the demo API")
    })
    .post("/", async (req: Request, res: Response) => {
        try{
            const data = req.body;
            await insertData(data);
            res.status(200).json({message: "Data send to demo successfully"});
        } catch (error){
            console.error("Data send to 'demo' unsuccessfully", error);
            res.status(500).json({ message: "Error inserting data" });
        }
    });

export default router;