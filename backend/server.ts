import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";

import User from "./types/User"


const app = express();
const port = process.env.PORT || 3001;
const FILE_PATH = path.join(__dirname, "../data/users.json");

app.use(express.json());
app.use(cors());

const readUsers = async (): Promise<User[]> => {
    try {
        await fs.access(FILE_PATH);
        const data = await fs.readFile(FILE_PATH, "utf8");
        return JSON.parse(data);
    } catch (error) {
        await fs.writeFile(FILE_PATH, "[]");
        return [];
    }
}

const writeUsers = async (users: User[]): Promise<void> => {
    await fs.writeFile(FILE_PATH, JSON.stringify(users, null, 2), "utf8");
}

app.post("/register", async (req, res) => {
    try {
        const users = await readUsers();
        const {username, password} = req.body as User;

        if (users.some((user) => user.username === username)) {
            return res.status(400).json({message: "Username already exists"});
        }

        users.push({username, password});
        await writeUsers(users);
        res.json({message: "Successfully registered"});

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({message: "Internal server error"});
    }
    }
)