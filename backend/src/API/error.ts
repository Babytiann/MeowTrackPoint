import express, { Request, Response } from "express";
import dotenv from 'dotenv';


dotenv.config({ path: '.env.development.local' });
const router = express.Router();

router
    .get("/", (req: Request, res: Response) => {
        res.json("Get a random book");
    })
    .post("/", (req: Request, res: Response) => {
        res.send("Add a book");
    })
    .put("/", (req: Request, res: Response) => {
        res.send("Update the book");
    });

export default router;
