import {userRegister, userSignIn} from '../controllers/usersController.js';
import express from 'express';

const router = express.Router();

router.route('/signUp').post(userRegister);
router.route('/signIn').post(userSignIn);



export default router;