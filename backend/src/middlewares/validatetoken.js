// middlewares son funciones que se ejcutan antes de llegar a unja ruta
// biblioteca para convertir cookies  npm i cookie-parser  
import jwt from "jsonwebtoken"
import {TOKEN_SECRET} from '../config.js'

 export const authRequired = (req,res,next) =>{

   const {token} = req.cookies
   if(!token) 
    return res.status(401).json({ message: "No token, authhorization denied"});

    jwt.verify(token, TOKEN_SECRET, ( err, user) => {
      if(err) return res.status(403).json({message: "invalid token"})


        req.user = user
        
        next()
    })


    

}