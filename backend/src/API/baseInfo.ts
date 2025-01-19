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
        await conn.query('create table if not exists baseInfo (' +
            'id int primary key auto_increment,' +
            'uuid varchar(255),' +
            'browser varchar(20),' +
            'os varchar(20),' +
            'referrer varchar(255),' +
            'create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)'); //referrer是来源网址，前端通过document.referrer 获取

        console.log("Table 'baseInfo' is ready.");
    }catch (error){
        console.error("create or connect table error",error);
    } finally{
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

    const { uuid, browser, os, referrer } = data as {
        uuid?: string,
        browser?: string,
        os?: string,
        referrer?: string
    }; //因为data的类型是unknown，所以需要断言一下

    try{
        const sql = 'insert into baseInfo (uuid, browser, os, referrer) values(?, ?, ?, ?)';
        const val = [uuid, browser, os, referrer];

        const [result, fields] = await conn.execute(sql, val);

        console.log(result);
        console.log(fields);
    } catch (error){
        console.error("Error inserting data:", error);
    }finally {
        await conn.end();
    }
}

initDatabase().catch(error => console.error(error));  //这个顶级调用会在导入的时候调用

const router = express.Router();

router
    .get("/", (_, res: Response) => {
        res.json("This is the baseInfo API")
    })
    .post("/",async (req: Request, res: Response) => {
        try{
            const data = req.body;
            await insertData(data);
            res.status(200).json({message: "Data send to baseInfo successfully"});
        }catch (error){
            console.error("Data send unsuccessfully", error);
            res.status(500).json({ message: "Error inserting data" });
        }
    });

export default router;