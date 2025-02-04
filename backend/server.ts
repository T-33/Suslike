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