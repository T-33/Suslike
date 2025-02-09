import express, {Request, Response} from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import bodyParser from "body-parser";
import bcrypt from 'bcrypt';

import multer from "multer";

import {User} from '../types/User';
import {Post} from '../types/Post';


const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const port = 3001;

const FILE_PATH = path.join(__dirname, '../../data/users.json');
const POSTS_FILE_PATH = path.join(__dirname, '../../data/posts.json');

const UPLOADS_DIR = path.join(__dirname, '../../data/user_avatars');
const POSTS_DIR = path.join(__dirname, '../../data/posts');
const BANNERS_DIR = path.join(__dirname, '../../data/user_banners');

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR);
}

const postStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, POSTS_DIR);
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadPostMedia = multer({ storage: postStorage });


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

/**
 * Finds user by username.
 * @param username
 * @return user with same username as specified or null if no such user exist.
 */
function findUser(username: string): User | undefined {
    const allUsers = readUsers();

    return allUsers.find(user => user.username == username);
}

app.get('/api/users/:username', (req, res) => {
   const username = req.params.username;
   const foundUser = findUser(username)

    if(foundUser == undefined) {
        res.status(404).json({error: 'No such user'});
    } else {
        console.log({foundUser})
        res.json(foundUser)
    }
})

app.post('/upload', upload.single("file"), (req: Request, res: Response) => {
    if(!req.file){
        res.status(400).json({error: 'No file uploaded'});
        return;
    }

    const fileUrl =  `http://localhost:${port}/uploads/${req.file.filename}`;
    res.json({url: fileUrl});
});

app.use("/uploads/posts", express.static(POSTS_DIR));
app.use("/uploads", express.static(UPLOADS_DIR));
app.use("/uploads/banners", express.static(BANNERS_DIR));

function generateNumericUserId(): number {
    return Math.floor(100000 + Math.random() * 900000);
}

function generateUniqueNumericUserId(users: User[]): number {
    let id : number;
    do {
        id = generateNumericUserId();
    } while (users.some(user => user.user_id === id));
    return id;
}

app.post("/register", async (req: Request, res: Response)=> {
    console.log('Received registration data:', req.body);
    const { username, password, ...otherFields } = req.body;

    if (!username || !password) {
        res.status(400).json({error: 'Username and password are required'});
        return;
    }

    if (password.length < 6) {
        res.status(400).json({error: 'Password must be at least 6 characters long'});
        return;
    }

    const users = readUsers();

    const isUsernameTaken = users.some((user) => user.username === username);
    if(isUsernameTaken){
        res.status(400).json({error: 'Username already taken'});
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
        user_id: generateUniqueNumericUserId(users),
        username,
        password: hashedPassword,
        ...otherFields
    };

    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ message: 'User registered successfully', user: newUser });
    return;
})

app.post('/login', async (req: Request, res: Response) => {
    const{username, password} = req.body;
    const users = readUsers();

    const user = users.find((user) => user.username === username);
    if (!user) {
        res.status(401).json({ error: "Non-existent user" });
        return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(401).json({ error: "Incorrect password" });
        return;
    }

    const { password: _, ...userData } = user;
    res.json({ message: "Login successful", user: userData });
})

app.post('/reset-password', async (req: Request, res: Response) => {
    const{username, newPassword} = req.body;
    let users = readUsers();

    const userIndex = users.findIndex((user) => user.username === username);
    if(userIndex === -1){
        res.status(404).json({error: "User not found!"});
        return;
    }

    if (newPassword.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters long' });
        return;
    }

    users[userIndex].password = await bcrypt.hash(newPassword, 10);
    writeUsers(users);

    res.json({ message: "Password updated successfully" });
    return;
})


function readPosts(): Post[] {
    if (!fs.existsSync(POSTS_FILE_PATH)) {
        fs.writeFileSync(POSTS_FILE_PATH, JSON.stringify([]));
    }
    const data = fs.readFileSync(POSTS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
}

function writePosts(posts: Post[]): void {
    fs.writeFileSync(POSTS_FILE_PATH, JSON.stringify(posts, null, 2));
}

app.post('/posts-upload', uploadPostMedia.single('file'), (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }
    const fileUrl = `http://localhost:${port}/uploads/posts/${req.file.filename}`;
    res.json({ url: fileUrl });
});


app.post('/posts', (req: Request, res: Response) => {
    const {post_id, ...otherFields } = req.body;

    const posts = readPosts();
    const newPost: Post = {
        post_id: posts.length + 1,
        ...otherFields,
    };

    posts.push(newPost);
    writePosts(posts);

    res.status(201).json({ message: 'Post created successfully', post: newPost });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});