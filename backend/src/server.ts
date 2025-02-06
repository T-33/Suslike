import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import bodyParser from "body-parser";

import multer from "multer";

import {User} from '../types/User'


const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const port = 3001;
const FILE_PATH = path.join(__dirname, '../../data/users.json');
const UPLOADS_DIR = path.join(__dirname, '../../data/user_avatars');

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, UPLOADS_DIR);
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + "-"  + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + path.extname(file.originalname));
    }
})

const upload = multer({storage});


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

app.post('/upload', upload.single("file"), (req: Request, res: Response) => {
    if(!req.file){
        res.status(400).json({error: 'No file uploaded'});
        return;
    }

    const fileUrl =  `http://localhost:${port}/uploads/${req.file.filename}`;
    res.json({url: fileUrl});
});

app.use("/uploads", express.static(UPLOADS_DIR));


app.post("/register", (req: Request, res: Response)=> {
    console.log('Received registration data:', req.body);
    const newUser : User = req.body;

    if (!newUser.username || !newUser.password) {
        res.status(400).json({error: 'Username and password are required'});
        return;
    }

    if (newUser.password.length < 6) {
        res.status(400).json({error: 'Password must be at least 6 characters long'});
        return;
    }

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

app.post('/login', (req: Request, res: Response) => {
    const{username, password} = req.body;
    const users = readUsers();

    const user = users.find((user) => user.username === username);
    if(!user || user.password !== password){
        res.status(401).json({error: "Incorrect username or password" });
        return;
    }
    res.json({ message: "Login successful", user });
})




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});