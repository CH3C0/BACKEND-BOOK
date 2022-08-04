import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { Schema } = mongoose;

const userSchema = new Schema({

    email: {
        type: String,
        require: true,
        match: [
            /^[_a-z0-9-]+(.[_a-z0-9-]+)@[a-z0-9-]+(.[a-z0-9-]+)(.[a-z]{2,4})$/i,
            'Please provide a valid email',
        ],
    },
    password: {
        type: String,
        require: true,
        minlength: 4,
        maxlength: 7 
    }
    
}, {timestamps: true})

userSchema.index({email: 1}, {unique: true});

userSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.passwordIsValid = async function(passwordCheck){
    const match = await bcrypt.compare(passwordCheck, this.password);
    return match;
}

userSchema.methods.createJWT = function(payload){
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIVETIME})
}

export default mongoose.model('Users', userSchema);