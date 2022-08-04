// require('dotenv').config();
import 'dotenv/config';
import express from 'express';
import books from './routers/books.js'
import users from './routers/usersRouts.js'
import mongoose from 'mongoose';
import notFound from './middleware/notfound.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT;
const URI = process.env.MONGOURI;

// Consumir API a Externos
app.use(cors());

// Habilitar Pug
app.set('view engine', 'pug');

// Conectar mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(URI, {});

// Habilitar bodyParser
app.use(express.json());

// Rutas
app.use('/', books);
app.use('/', users);
app.use(notFound);

// Arrancar servidor
app.listen(PORT, () => console.log(`Start Server in ${PORT}`));