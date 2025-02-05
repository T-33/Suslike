import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

import {User} from '../types/User'


const app = express();
const port = process.env.PORT || 3001;

const FILE_PATH = path.join(__dirname, "../data/users.json");

app.use(express.json());

function readUsers(): User[] {
    if (!fs.existsSync(FILE_PATH)) {
        fs.writeFileSync(FILE_PATH, JSON.stringify([]));
    }
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(data);
}

function writeUsers(users: User[]): void {
    fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2));
}

app.post("/register", (req: Request, res: Response)=> {
    const newUser : User = req.body;
    const users = readUsers();

    const isUsernameTaken = users.some((user) => user.username === newUser.username);
    if(isUsernameTaken){
        res.status(400).json({error: 'Username already taken'});
        return;
    }

    newUser.user_id = users.length + 1;

    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ message: 'User registered successfully', user: newUser });
    return;
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});