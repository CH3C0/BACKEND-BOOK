import Users from '../models/Users.js';
import StatusCodes from 'http-status-codes';

const userRegister = async (req, res) => {
    
    const newUser = req.body;
    
    try{
        await Users.create(newUser);
        return res.status(StatusCodes.OK).json({msg: 'El email fue creado exitosamente'});
    }catch(err){
        if(err.code === 11000) {
            return res.status(StatusCodes.BAD_REQUEST).json({msg: 'email ya existe'});
        }
    }
}

const userSignIn = async (req, res) => {

    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(StatusCodes.UNAUTHORIZED).json({msg: 'Email y password son requeridos'});
    }

    const user = await Users.findOne({email});

    if(!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({msg: 'Email Not found'}); 
    }else {
        const passwordValid = await user.passwordIsValid(password);

        if(!passwordValid) {
            return res.status(StatusCodes.UNAUTHORIZED).json({msg: 'email o password incorrecta'});
        }else {
            const token = user.createJWT(req.body);
            return res.status(StatusCodes.OK).json({msg: 'Inicio de Sesion correcta', token});
        }
    }

}

export {userRegister, userSignIn};