import Meta from "../models/metas.model.js";

// Función segura para obtener el id del propietario
const getOwnerId = (userField) => {
  if (!userField) return null;
  if (typeof userField === "object") {
    return userField._id?.toString?.() || null;
  }
  return userField.toString();
};

export const getMetas = async (req, res) => {
  try {
    const metas = await Meta.find({ user: req.user.id }).populate("user");
    return res.json(metas);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener las metas",
      error: error.message,
    });
  }
};

export const createMetas = async (req, res) => {
  try {
    const { titulo, descripcion, valorObjetivo, fecha } = req.body;

    const newMeta = new Meta({
      titulo,
      descripcion,
      valorObjetivo,
      fecha,
      user: req.user.id,
    });

    const savedMeta = await newMeta.save();
    return res.json(savedMeta);

  } catch (error) {
    return res.status(500).json({
      message: "Error al crear nueva meta",
      error: error.message,
    });
  }
};

export const getMeta = async (req, res) => {
  try {
    const meta = await Meta.findById(req.params.id).populate("user");
    if (!meta) {
      return res.status(404).json({ message: "Meta no encontrada" });
    }
    return res.json(meta);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener la meta",
      error: error.message,
    });
  }
};

export const updateMeta = async (req, res) => {
  try {
    const { titulo, descripcion, valorObjetivo } = req.body;
    const meta = await Meta.findById(req.params.id);

    if (!meta) {
      return res.status(404).json({ message: "Meta no encontrada" });
    }

    const ownerId = getOwnerId(meta.user);
    if (ownerId !== req.user.id) {
      return res.status(403).json({
        message: "No tienes permiso para actualizar esta meta",
      });
    }

    const updatedMeta = await Meta.findByIdAndUpdate(
      req.params.id,
      { titulo, descripcion, valorObjetivo },
      { new: true }
    ).populate("user", "username email");

    return res.json(updatedMeta);
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar la meta",
      error: error.message,
    });
  }
};

export const deleteMeta = async (req, res) => {
  try {
    const meta = await Meta.findById(req.params.id);

    if (!meta) {
      return res.status(404).json({ message: "Meta no encontrada" });
    }

    const ownerId = getOwnerId(meta.user);
    if (ownerId !== req.user.id) {
      return res.status(403).json({
        message: "No tienes permiso para eliminar esta meta",
      });
    }

    // Los tests esperan que NO uses meta.deleteOne()
    await Meta.findByIdAndDelete(req.params.id);

    return res.sendStatus(204);

  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar la meta",
      error: error.message,
    });
  }
};

export const actualizarAhorroMeta = async (req, res) => {
  try {
    const { id } = req.params;
    const { valorAhorro } = req.body;

    const meta = await Meta.findById(id);

    if (!meta) {
      return res.status(404).json({ message: "Meta no encontrada" });
    }

    const ownerId = getOwnerId(meta.user);
    if (ownerId !== req.user.id) {
      return res.status(403).json({
        message: "No tienes permiso para actualizar esta meta",
      });
    }

    if (valorAhorro > meta.valorObjetivo) {
      return res.status(400).json({
        message: "El ahorro no puede exceder el valor objetivo de la meta.",
      });
    }

    const metaActualizada = await Meta.findByIdAndUpdate(
      id,
      { valorAhorroActual: valorAhorro },
      { new: true }
    ).populate("user", "username email");

    return res.json(metaActualizada);

  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el ahorro de la meta",
      error: error.message,
    });
  }
};
