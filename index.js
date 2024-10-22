import express from "express";
import dotenv from 'dotenv';
import fileUpload from "express-fileupload";
import cors from 'cors';
import bodyParser from "body-parser";
import connectDb from './utils/db.js';
import route from './route/routes.js';

dotenv.config();

const app = express();
const port =  3500;

// Middlewares
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 
app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(fileUpload({ useTempFiles: true })); 

// Routes
app.use('/', route);

const startServer = async () => {
    try {
        await connectDb(); 
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit if DB connection fails
    }
};

startServer();
