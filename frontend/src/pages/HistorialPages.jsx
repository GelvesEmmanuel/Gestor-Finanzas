// src/pages/HistorialPages.jsx

import React, { useState, useEffect } from 'react';
import { useHistorial } from '../context/historialContext';
import { useFinanzas } from "../context/finanzasContext";
import { downloadHistorialRequest } from '../api/historial';

function HistorialPages() {
  const { historial, loading, error, fetchHistorial } = useHistorial();
  const { deleteFinanza, updateFinanza } = useFinanzas();
  const [fechaInicio, setFechaInicio] = useState('2025-01-01');
  const [fechaFin, setFechaFin] = useState('2025-12-31');

  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [formatoSeleccionado, setFormatoSeleccionado] = useState('excel');

  
  // MODAL EDITAR
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFinanza, setEditingFinanza] = useState({
    _id: null,
    descripcion: "",
    valor: "",
    tipo: "",
  });
  // MODAL ELIMINAR
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [finanzaToDelete, setFinanzaToDelete] = useState(null);
  
  // ABRIR MODAL EDITAR
  const openEditModal = (item) => {
    setEditingFinanza({
      _id: item.id || item._id,
      descripcion: item.descripcion,
      valor: item.monto,
      tipo: item.accion,
    });
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };
  // GUARDAR CAMBIOS EDITAR
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await updateFinanza(editingFinanza._id, {
      descripcion: editingFinanza.descripcion,
      valor: editingFinanza.valor,
      tipo: editingFinanza.tipo,
    });
    await fetchHistorial();
    closeEditModal();
  };
  // ABRIR MODAL ELIMINAR
  const openDeleteModal = (item) => {
    setFinanzaToDelete(item.id || item._id);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setFinanzaToDelete(null);
    setIsDeleteModalOpen(false);
  };
  const confirmDelete = async () => {
    if (finanzaToDelete) {
      await deleteFinanza(finanzaToDelete);
      await fetchHistorial();
      closeDeleteModal();
    }
  };
    const finanzasFiltradas = (historial || [])
    .filter((item) => item.tipo === "Finanza")
    .filter((item) => {
      if (fechaInicio && new Date(item.fecha) < new Date(fechaInicio)) return false;
      if (fechaFin && new Date(item.fecha) > new Date(fechaFin)) return false;
      return true;
    });
  
  useEffect(() => {
    fetchHistorial();
  }, []);

  const handleBuscar = async () => {
    try {
      if (new Date(fechaInicio) > new Date(fechaFin)) {
        alert("La fecha de inicio no puede ser posterior a la fecha final.");
        return;
      }
      await fetchHistorial(fechaInicio, fechaFin);
    } catch (err) {
      console.error("Error al buscar historial:", err);
    }
  };

  const handleDownloadClick = () => {
    setIsDownloadModalOpen(true);
  };

  const closeDownloadModal = () => {
    setIsDownloadModalOpen(false);
  };

  const handleDownloadConfirm = async () => {
    try {
      const response = await downloadHistorialRequest(fechaInicio, fechaFin, formatoSeleccionado);

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;

      const disposition = response.headers['content-disposition'];
      let filename = "historial_finanzas";

      if (disposition && disposition.indexOf("attachment") !== -1) {
        const matches = disposition.match(/filename="?([^"]+)"?/);
        if (matches?.[1]) filename = matches[1];
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      closeDownloadModal();
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
      alert('Hubo un error al descargar el archivo.');
    }
  };

  if (loading) {
    return <div className="text-center py-10">... Cargando historial ...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl space-y-8">

        <h1 className="text-4xl font-bold text-black text-center mb-2">
          Historial
        </h1>

        <p className="text-lg text-gray-700 text-center mb-6">
          Consulta el historial de tus finanzas y metas.
        </p>

        {/* Tabla */}
        <div className="max-h-70 overflow-y-auto overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr key="header" className="bg-green-800 text-white">
                <th className="px-6 py-4 text-center">Fecha</th>
                <th className="px-6 py-4 text-center">Tipo</th>
                <th className="px-6 py-4 text-center">Acción</th>
                <th className="px-6 py-4 text-center">Descripción</th>
                <th className="px-6 py-4 text-center">Monto</th>
                <th className="px-6 py-4 text-center"></th>
              </tr>
            </thead>

            <tbody>
              {historial.length === 0 ? (
                <>
                  <tr key="empty">
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No hay movimientos registrados.
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  {historial.map((item) => (
                    <tr
                      key={item._id || item.id}
                      className={`border-b ${item.tipo === 'Finanza'
                        ? item.accion === 'Ingreso'
                          ? 'bg-green-50'
                          : 'bg-red-50'
                        : 'bg-blue-50'
                        }`}
                    >
                      <td className="px-6 py-4 text-center">
                        <span className="text-base text-black">
                          {new Date(item.fecha).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-base font-medium text-gray-800">
                          {item.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`text-base font-medium ${item.tipo === 'Finanza'
                            ? item.accion === 'Ingreso'
                              ? 'text-green-600'
                              : 'text-red-600'
                            : 'text-blue-600'
                            }`}
                        >
                          {item.accion}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="text-base text-gray-700">
                          {item.descripcion}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        {item.monto !== undefined && item.monto !== null ? (
                          <span
                            className={`text-lg font-bold ${item.tipo === 'Finanza'
                              ? item.accion === 'Ingreso'
                                ? 'text-green-800'
                                : 'text-red-800'
                              : 'text-blue-800'
                              }`}
                          >
                            ${item.monto}
                          </span>
                        ) : (
                          <span className="text-lg font-bold text-gray-400">--</span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center text-black">
                          <div className="flex justify-center space-x-2">
                            {/* ELIMINAR */}
                            <button
                              onClick={() => openDeleteModal(item)}
                              className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-md"
                            >
                              🗑️
                            </button>
                            {/* EDITAR */}
                            <button
                              onClick={() => openEditModal(item)}
                              className="bg-green-800 hover:bg-green-900 transition text-white px-4 py-2 rounded-md"
                            >
                              ✏️
                            </button>
                          </div>
                        </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
           {isEditModalOpen && (
          <div className="fixed inset-0 bg-white/80 bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-center text-black">
                Editar movimiento
              </h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="text-gray-700">Descripción:</label>
                  <input
                    type="text"
                    value={editingFinanza.descripcion}
                    onChange={(e) =>
                      setEditingFinanza({
                        ...editingFinanza,
                        descripcion: e.target.value,
                      })
                    }
                    className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-md"
                  />
                </div>
                <div>
                  <label className="text-gray-700">Valor:</label>
                  <input
                    type="number"
                    value={editingFinanza.valor}
                    onChange={(e) =>
                      setEditingFinanza({
                        ...editingFinanza,
                        valor: e.target.value,
                      })
                    }
                    className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-md"
                  />
                </div>
                <div>
                  <label className="text-gray-700">Tipo:</label>
                  <select
                    value={editingFinanza.tipo}
                    onChange={(e) =>
                      setEditingFinanza({
                        ...editingFinanza,
                        tipo: e.target.value,
                      })
                    }
                    className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-md"
                  >
                    <option value="Ingreso">Ingreso</option>
                    <option value="Gasto">Gasto</option>
                  </select>
                </div>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md">
                  Guardar cambios
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md mt-2"
                >
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        )}
        {/* MODAL ELIMINAR */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-white/80 bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-center text-black">
                Confirmar eliminación
              </h2>
              <p className="text-gray-700 text-center mb-6">
                ¿Seguro que deseas eliminar esta finanza? No se puede deshacer.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={confirmDelete}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-md"
                >
                  Sí, eliminar
                </button>
                <button
                  onClick={closeDeleteModal}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-md"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Buscador y descarga */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-center text-black">Buscar por fechas</h2>

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex flex-col items-center justify-center flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1">Desde:</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full max-w-xs bg-gray-200 text-gray-900 px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-center"
              />
            </div>

            <div className="flex flex-col items-center justify-center flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1">Hasta:</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full max-w-xs bg-gray-200 text-gray-900 px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-center"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 items-center justify-center">
            <button
              onClick={handleBuscar}
              className="w-full max-w-xs bg-green-600 hover:bg-green-700 transition-transform text-white font-semibold px-6 py-3 rounded-full transform hover:scale-105 duration-300"
            >
              Buscar
            </button>

            <button
              onClick={handleDownloadClick}
              className="w-full max-w-xs bg-yellow-500 hover:bg-yellow-600 transition-transform text-white font-semibold px-6 py-3 rounded-full transform hover:scale-105 duration-300"
            >
              Descargar
            </button>
          </div>
        </div>

        {/* Modal */}
        {isDownloadModalOpen && (
          <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-black text-center">
                Seleccionar formato de descarga
              </h2>

              <div className="flex flex-col space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="formato"
                    value="excel"
                    checked={formatoSeleccionado === 'excel'}
                    onChange={(e) => setFormatoSeleccionado(e.target.value)}
                  />
                  <span className="text-base text-gray-700">Excel (.xlsx)</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="formato"
                    value="pdf"
                    checked={formatoSeleccionado === 'pdf'}
                    onChange={(e) => setFormatoSeleccionado(e.target.value)}
                  />
                  <span className="text-base text-gray-700">PDF (.pdf)</span>
                </label>
              </div>

              <div className="flex flex-col gap-2 mt-6">
                <button
                  onClick={handleDownloadConfirm}
                  className="w-full bg-green-600 text-white py-3 rounded-full hover:bg-green-700"
                >
                  Descargar
                </button>

                <button
                  onClick={closeDownloadModal}
                  className="w-full bg-red-500 text-white py-3 rounded-full hover:bg-red-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-12 bg-gray-50 text-center text-sm text-gray-500 py-6 border-t border-gray-200 w-full">
          <p className="text-xs">© {new Date().getFullYear()} FinanzasApp. Todos los derechos reservados.</p>
        </footer>

      </div>
    </div>
  );
}

export default HistorialPages;