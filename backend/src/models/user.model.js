// utilizo los modelos para definirle a mongodb como de ser la informacion que debe guardar en este caso los usuarios 

import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    }, 
},
{
    //guarda la hora d ecreaccion y actualizacion
    timestamps: true
}
);
// exporto y creo un modelo nuevo llamdo user el cual sera una collecion que crea mongosse, el model es para poder hacer consultas
export default mongoose.model('User', userSchema)