// require('dotenv').config();
import 'dotenv/config';
import express from 'express';
import books from './routers/books.js'
import users from './routers/usersRouts.js'
import mongoose from 'mongoose';
import notFound from './middleware/notFound.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT;
const URI = process.env.MONGOURI;

// Habilitar bodyParser
app.use(express.json());

// Consumir API a Externos
app.use(cors());

// Rutas
app.use('/', books);
app.use('/', users);
app.use(notFound);

// Arrancar servidor
const start = async () => {
    try {
        mongoose.connect(URI, {});
        console.log('Conected to DB');
        app.listen(PORT, () => console.log(`Listening on port`, +PORT));
    } catch (error) {
        console.log(error);
    }
};

start();