import { Router } from "express";
import {authRequired} from '../middlewares/validatetoken.js'

import {getFinanza ,getFinanzas, createFinanzas, updateFinanzas, deleteFinanzas, getBalance, getFinanzasPeriodo} from '../controllers/finanzas.controller.js'
const router = Router()

router.get('/finanzas', authRequired,getFinanzas) 
router.get('/finanzas/:id', authRequired, getFinanza)
router.post('/finanzas', authRequired, createFinanzas) 
router.delete('/finanzas/:id', authRequired, deleteFinanzas )
router.put('/finanzas/:id', authRequired, updateFinanzas )
router.get('/finanzasBalance', authRequired, getBalance)
router.post('/finanzasPeriodo', authRequired, getFinanzasPeriodo)
router.post('/metas', authRequired, getFinanzasPeriodo)


export default router