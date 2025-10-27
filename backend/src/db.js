import mongoose from "mongoose";

export const connectDB = async () =>{
    try{
         await mongoose.connect('mongodb://localhost:27017/gestor-finanzas') 
         console.log("conexion esitosa")

    }catch(error){
        console.log(error )
    }
   
};

