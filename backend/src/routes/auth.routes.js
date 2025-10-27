import { Router } from "express";
import {login, register, logout, profile, verifyToken} from '../controllers/auth.controller.js'
import { authRequired} from '../middlewares/validatetoken.js'
import { validateSchema } from '../middlewares/validator.Middlewar.js'
import {registerSchema, loginSchema} from '../schemas/auth.schema.js'


const router = Router()
router.post('/register',  validateSchema(registerSchema), register)
router.post('/login', validateSchema(loginSchema), login )
router.post('/logout', logout)
router.get('/verify', verifyToken)

// aqui loq ue estoy haciendo  es que cuando pido la ruta profile , paso por la funcion middlware authrequired y despues de ahi si paso a profile
router.get('/profile', authRequired, profile)

export default router    