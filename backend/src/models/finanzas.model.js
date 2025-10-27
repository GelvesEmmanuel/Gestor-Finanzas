import mongoose from "mongoose";
import { required } from "zod/mini";
import { _enum } from "zod/v4/core";

const finanzasSchema =new mongoose.Schema({

    valor:{
        type: Number,
        required: true
    },

    descripcion:{
        type: String,
        required: true,
    },
    tipo: {
        type: String,
        enum: ['Ingreso', 'Gasto'],
        required: true
    },
    fecha:{
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
{
    timestamps: true
})

export default mongoose.model('Finanza', finanzasSchema);