import express, { Request, Response } from "express";

const router = express.Router();

router
    .get("/", (_, res: Response) => {
        res.json("111")
    })
    .post("/", (req: Request, res: Response) => {
        // 获取请求体内容
        const { name, age } = req.body;
        console.log(name, age); // 打印请求体中的数据
        res.json("111")
    })


export default router;
