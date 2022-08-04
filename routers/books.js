import express from 'express';
import { viewBook, viewBookIdText, addBook, updateBook, deleteBook } from '../controllers/bookController.js';
import { isAuthenticated } from '../middleware/authorization.js';
import multer from 'multer';
import uploadSingleHandler from '../utils/upLoad.js'


const router = express.Router();

const upload = multer({dest: './temp'})

router.route('/upload-img').post(upload.single('img'), uploadSingleHandler);

router.route('/books')
    .get(viewBook)
    .post(isAuthenticated(), addBook);

router.route('/books/:name/:id')
    .get(viewBookIdText);

router.route('/books/:id')
    .put(isAuthenticated(), updateBook)
    .delete(isAuthenticated(), deleteBook)



export default router;