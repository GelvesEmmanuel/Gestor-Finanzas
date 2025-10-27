import {TOKEN_SECRET} from '../config.js'
import jwt from 'jsonwebtoken';

export function createdAccesToken(payload){  // funcion para crear token 
   return new Promise((resolve, reject) =>{
        jwt.sign(
            payload,
            TOKEN_SECRET    ,
            {
                expiresIn: "1d"
            },
            (err, token) =>{
                if(err) reject(err)
                resolve(token)
            }
            );
    })
}
    