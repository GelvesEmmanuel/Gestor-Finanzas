import Finanza from "../models/finanzas.model.js";

export const getFinanzas = async (req, res) => {
  const finanzas = await Finanza.find({
    user: req.user.id, // trae solo las tareas del u8suario autenticado
  }).populate("user");
  res.json(finanzas);
};

export const createFinanzas = async (req, res) => {
  try {
    const { valor, descripcion, fecha, tipo } = req.body;

    if (!["Ingreso", "Gasto"].includes(tipo)) {
      return res
        .status(400)
        .json({ message: "El tipo debe ser gasto o Ingreso" });
    }
    const newFinanza = new Finanza({
      valor,
      descripcion,
      tipo,
      fecha,
      user: req.user.id, // guardo e usuarioq ue esta utenticado
    });

    const savedFinanza = await newFinanza.save();
    res.json(savedFinanza);
  } catch (error) {
    res.status(500).json({ message: "Error al guardar registro", error });
  }
};
export const getFinanza = async (req, res) => {
  const finanza = await Finanza.findById(req.params.id).populate("user"); // el req.paramks.id es el :id que sale junto al url en finanzas.routes.js
  if (!finanza) return res.status(404).json({ message: "tarea no encontrada" });
  res.json(finanza);
};
export const updateFinanzas = async (req, res) => {
  const finanza = await Finanza.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }); // el req.paramks.id es el :id que sale junto al url en finanzas.routes.js
  if (!finanza) return res.status(404).json({ message: "tarea no encontrada" });
  res.json(finanza);
};

export const deleteFinanzas = async (req, res) => {
  const finanza = await Finanza.findByIdAndDelete(req.params.id); // el req.paramks.id es el :id que sale junto al url en finanzas.routes.js
  if (!finanza) return res.status(404).json({ message: "tarea no encontrada" });
  return res.sendStatus(204);
};

// obtener balance total del usuario al momento de ingresar cada finanza

export const getBalance = async (req, res) => {
  try {
    const finanzas = await Finanza.find({ user: req.user.id });
    //separar ingreoss de gastos

    const ingresos = finanzas
      .filter((f) => f.tipo === "Ingreso")
      .reduce((sum, f) => sum + f.valor, 0);

    const gastos = finanzas
      .filter((f) => f.tipo === "Gasto")
      .reduce((sum, f) => sum + f.valor, 0);
    const balance = ingresos - gastos;

    res.json({ ingresos, gastos, balance});
  } catch (error) {
    res.status(500).json({ message: "error al obtener un balance", error})
  }
};


// funcion obetener finanzas por periodo
export const getFinanzasPeriodo = async (req, res) => {

  try {
    const {fechaInicio, fechaFin} = req.body;
    if(!fechaInicio || !fechaFin){
      return res.status(400).json({ message: "valores incorrectos"})
    }

    const finanzas = await Finanza.find({
      user: req.user.id,
      fecha: {$gte: new Date(fechaInicio), $lte: new Date(fechaFin)}
    })
    console.log(fechaInicio, fechaFin)

    const ingresosPeriodo = finanzas
      .filter((f) => f.tipo === "Ingreso")
      .reduce((sum, f) => sum + f.valor, 0);

    const gastosPeriodo = finanzas
      .filter((f) => f.tipo === "Gasto")
      .reduce((sum, f) => sum + f.valor, 0);

    const balancePeriodo = ingresosPeriodo - gastosPeriodo;

    res.json({
      ingresosPeriodo,
      gastosPeriodo,
      balancePeriodo,
      registros: finanzas
    })
     
  } catch (error) {
    res.json(500).json({ message:"Error al obtener fiannzas por periodo"})
  }
};
