import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";

import User from "../frontend/src/types/User"


const app = express();
const port = process.env.PORT || 3001;
const FILE_PATH = path.join(__dirname, "../data/users.json");

app.use(express.json());
app.use(cors());

const readUsers = async (): Promise<User[]> => {
    try{
        await fs.access(FILE_PATH);
        const data = await fs.readFile(FILE_PATH, "utf8");
        return JSON.parse(data);
    } catch (error) {
        await fs.writeFile(FILE_PATH, "[]");
        return [];
    }
}

const writeUser = async (users: User[]): Promise<void> => {
    await fs.writeFile(FILE_PATH, JSON.stringify(users, null, 2), "utf8");
}

