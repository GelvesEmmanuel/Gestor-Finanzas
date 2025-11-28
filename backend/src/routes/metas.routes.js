import { Router } from "express";
import { authRequired } from "../middlewares/validatetoken.js";
import {
  getMeta,
  getMetas,
  updateMeta,
  createMetas,
  deleteMeta,
  actualizarAhorroMeta,
} from "../controllers/metas.controller.js";
import { get } from "mongoose";

const router = Router();

router.get("/metas", authRequired, getMetas);
router.get("/metas/:id", authRequired, getMeta);
router.post("/metas", authRequired, createMetas);
router.put("/metas/:id", authRequired, updateMeta);
router.delete("/metas/:id", authRequired, deleteMeta);
//router.put("/metas/:id", authRequired, actualizarAhorroMeta);

export default router;
