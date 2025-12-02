import mongoose from "mongoose";

export const connectDB = async () =>{
    try{
         await mongoose.connect(process.env.MONGO_URI) 
         console.log("conexion esitosa")

    }catch(error){
        console.log(error )
    }
   
};

