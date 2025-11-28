import mongoose from "mongoose";

const metasSchema = new mongoose.Schema({

 titulo: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    valorObjetivo: { // Nombre del campo más descriptivo
        type: Number,
        required: true,
    },
    valorAhorroActual: { // Campo para llevar el registro del ahorro
        type: Number,
        default: 0, 
    },
    user: { // Referencia al usuario propietario de la meta
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
{
    timestamps: true // Crea campos de createdAt y updatedAt automáticamente
});

export default mongoose.model('Meta', metasSchema)