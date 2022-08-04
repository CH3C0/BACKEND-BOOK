import Users from '../models/Users.js'
import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import compose from 'composable-middleware'

const getUserByEmail = async (email) => {
    try {
        const user = await Users.findOne({email});

        if(user) {
            return user
        }
    } catch (error) {
        console.log(error)
    }
}

export const isAuthenticated = (req, res, next) => {
    return compose().use(async (req, res, next) => {
        const authHeader = req.headers.authorization;
        try {
            if(!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Token not provided'})
            }

            const token = authHeader.split(' ')[1];
            const decode = jwt.verify(token, process.env.JWT_SECRET);

            const user = await getUserByEmail(decode.email);

            if(!user) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'No autorizado'});
            }

            req.user = user;
            next();

        } catch (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json(error);
        }
    })
}
