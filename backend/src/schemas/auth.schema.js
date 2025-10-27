import {z} from 'zod'
import { email } from 'zod/mini'
// creamos schemas para validar los dsatos que recibimos del cliente 
export const registerSchema = z.object({
    username: z.string({
        required_error: 'El nombre de usuario es requerido'
    }),
    email: z.string({
        required_error: 'EL email es requerido'
    }).email({required_error: 'Email invalido'}),
    password: z.string({
        required_error: 'Contrasena es requerida'
    }).min(6,{
        message: 'Contrasena debe ser mayor a 6 caracteres'
    })
})

export const loginSchema = z.object({
    username: z.string({
        required_error: 'Nombre de usuario es requerido'
    }),
   password: z.string({
        required_error: 'Contrasena es requerida'
    }).min(6,{
        message: 'contrasena debe ser mayor a 6 caracteres'
    })
})