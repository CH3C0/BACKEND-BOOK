import mongoose from 'mongoose';

const { Schema } = mongoose;

const chaptersSchema = new Schema({
    id: Number,
    title: {
        type: String
    },
    text: {
        type: String,
        required: [true, "texto Requerido"],
        minlength: 5
    },
    _id: false
});

const bookSchema = new Schema({
        createBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        },
        name: {
            type: String,
            required: true,
             
        },
        img: {
            type: String,
            required: true,
        },
        chapters: [
            chaptersSchema
        ]
    
});

bookSchema.index({name: 1}, {unique: true});

export default mongoose.model('Books', bookSchema);