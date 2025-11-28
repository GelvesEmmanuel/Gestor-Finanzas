// src/pages/MetasPages.jsx
import React, { useState, useEffect } from 'react'; // Añadido useEffect
import { useMeta } from '../context/metasContext'; // Importa el hook del contexto

function MetasPages() {
  const { metas, loading, createMeta, updateMeta, deleteMeta, fetchMetas } = useMeta(); // Obtiene funciones y estado del contexto
  // Estados para modales y edición (esto puede mantenerse localmente)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Nuevo estado para modal de confirmación
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // Nuevo estado para modal de éxito al crear
  const [isUpdateSuccessModalOpen, setIsUpdateSuccessModalOpen] = useState(false); // Nuevo estado para modal de éxito al actualizar
  const [updatedMeta, setUpdatedMeta] = useState(null); // Almacena la meta recién actualizada
  const [metaToDelete, setMetaToDelete] = useState(null); // Almacena el ID de la meta a eliminar
  const [newMetaCreated, setNewMetaCreated] = useState(null); // Almacena la meta recién creada
  const [editingItem, setEditingItem] = useState({
    _id: null,
    titulo: '',
    descripcion: '',
    valor: ''
  });
  // Función para abrir el modal de creación
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };
  // Función para cerrar el modal de creación
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };
  // Función para abrir el modal de edición
  const openEditModal = (meta) => {
    setEditingItem(meta);
    setIsEditModalOpen(true);
  };
  // Función para cerrar el modal de edición
  const closeEditModal = () => {
    setEditingItem({ _id: null, titulo: '', descripcion: '', valor: '' }); // Limpiar datos
    setIsEditModalOpen(false);
  };
  // Función para abrir el modal de confirmación de eliminación
  const openDeleteModal = (metaId) => {
    setMetaToDelete(metaId);
    setIsDeleteModalOpen(true);
  };
  // Función para cerrar el modal de confirmación de eliminación
  const closeDeleteModal = () => {
    setMetaToDelete(null);
    setIsDeleteModalOpen(false);
  };
  // Función para abrir el modal de éxito al crear
  const openSuccessModal = (meta) => {
    setNewMetaCreated(meta);
    setIsSuccessModalOpen(true);
  };
  // Función para cerrar el modal de éxito al crear
  const closeSuccessModal = () => {
    setNewMetaCreated(null);
    setIsSuccessModalOpen(false);
  };
  // Función para abrir el modal de éxito al actualizar
  const openUpdateSuccessModal = (meta) => {
    setUpdatedMeta(meta);
    setIsUpdateSuccessModalOpen(true);
  };
  // Función para cerrar el modal de éxito al actualizar
  const closeUpdateSuccessModal = () => {
    setUpdatedMeta(null);
    setIsUpdateSuccessModalOpen(false);
  };
  // Función para manejar la creación de una nueva meta (ahora con API)
  const handleCreateMeta = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nuevaMetaData = {
      titulo: formData.get('titulo'),
      descripcion: formData.get('descripcion'),
      valorObjetivo: parseFloat(formData.get('valorObjetivo')) // Asegúrate del tipo correcto
      // Añade aquí otros campos si es necesario, pero no el 'user', el backend lo obtiene del token
    };
    try {
      const metaCreada = await createMeta(nuevaMetaData); // Llama a la función del contexto y obtiene la meta creada
      closeCreateModal();
      openSuccessModal(metaCreada); // Abre el modal de éxito con la meta recién creada
    } catch (error) {
      console.error("Error al crear la meta:", error);
      // Opcional: Mostrar mensaje de error al usuario
    }
  };
  // Función para manejar la actualización de una meta (ahora con API)
  const handleUpdateMeta = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const metaActualizadaData = {
      titulo: formData.get('titulo'),
      descripcion: formData.get('descripcion'),
      valorObjetivo: parseFloat(formData.get('valor')) // Asegúrate del tipo correcto
    };
    try {
      const metaActualizada = await updateMeta(editingItem._id, metaActualizadaData); // Llama a la función del contexto y obtiene la meta actualizada
      closeEditModal();
      openUpdateSuccessModal(metaActualizada); // Abre el modal de éxito al actualizar
    } catch (error) {
      console.error("Error al actualizar la meta:", error);
      // Opcional: Mostrar mensaje de error al usuario
    }
  };
  // Función para confirmar la eliminación (llamada desde el modal)
  const confirmDelete = async () => {
    if (metaToDelete) {
      try {
        await deleteMeta(metaToDelete); // Llama a la función del contexto
        // El estado 'metas' se actualiza automáticamente en el contexto
      } catch (error) {
        console.error("Error al eliminar la meta:", error);
        // Opcional: Mostrar mensaje de error al usuario
      } finally {
        closeDeleteModal(); // Cierra el modal después de intentar eliminar
      }
    }
  };
  // Mostrar estado de carga
  if (loading) {
    return <div className="text-center py-10">... Cargando metas...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      {/* Contenedor principal*/}
      <div className="w-full max-w-6xl space-y-8">
        {/* Título */}
        <h1 className="text-4xl font-bold text-black text-center mb-6">
          Estas son tus Metas
        </h1>
        {/* Tabla */}
        <div className="max-h-80 overflow-y-auto overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-green-800 text-white">
                <th className="px-6 py-4 text-center">Título</th>
                <th className="px-6 py-4 text-center">Descripción</th>
                <th className="px-6 py-4 text-center">Valor</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {metas.map((meta) => (
                <tr key={meta._id} className={`border-b ${meta._id % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-900">{meta.titulo}</span>
                    </div>
                  </td>
                  {/* Celda Descripción*/}
                  <td className="px-6 py-4 text-center"> 
                    <span className="text-base text-gray-700">
                      {meta.descripcion}
                    </span>
                  </td>
                  {/* Celda Valor */}
                  <td className="px-6 py-4 text-center"> 
                    <span className="text-lg font-bold text-green-600">
                      ${meta.valorObjetivo}
                    </span>
                  </td>
                  {/* Celda Acciones */}
                  <td className="px-6 py-4 text-center"> 
                    <div className="flex justify-center space-x-2"> 
                      {/* Botón Eliminar - Ahora llama a openDeleteModal */}
                      <button
                        onClick={() => openDeleteModal(meta._id)}
                        className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-md font-medium flex items-center justify-center"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                      {/* Botón Actualizar - ahora llama a openEditModal */}
                      <button
                        onClick={() => openEditModal(meta)} 
                        className="bg-green-800 hover:bg-green-900 transition text-white px-4 py-2 rounded-md font-medium flex items-center justify-center"
                        title="Actualizar"
                      >
                        ✏️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Botón Nueva Meta */}
        <div className="text-center">
          <button
            onClick={openCreateModal}
            className="bg-green-600 hover:bg-green-700 transition-transform text-white font-semibold px-8 py-3 rounded-full text-lg transform hover:scale-105 duration-300"
          >
            Nueva Meta
          </button>
        </div>
        {/* Modal ventana emergente de Creación */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-white/80 bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-black">Registrar Nueva meta</h2>
              <form onSubmit={handleCreateMeta} className="space-y-4">
                {/* Campo Título */}
                <div className="flex flex-col text-left">
                  <label className="text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input
                    type="text"
                    name="titulo"
                    placeholder="Título de la meta"
                    className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                {/* Campo Descripción de la Meta */}
                <div className="flex flex-col text-left">
                  <label className="text-sm font-medium text-gray-700 mb-1">Descripción de la Meta</label>
                  <input
                    type="text"
                    name="descripcion"
                    placeholder="Describe brevemente tu objetivo de ahorro."
                    className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                {/* Campo Monto Objetivo */}
                <div className="flex flex-col text-left">
                  <label className="text-sm font-medium text-gray-700 mb-1">Valor</label>
                  <input
                    type="number"
                    name="valorObjetivo"
                    placeholder="Define la cantidad total que deseas ahorrar."
                    className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                {/* Botones Guardar y Cancelar */}
                <div className="flex flex-col gap-2">
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 transition text-white font-semibold px-6 py-3 rounded-full"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={closeCreateModal}
                    className="w-full bg-red-500 hover:bg-red-600 transition text-white font-semibold px-6 py-3 rounded-full"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Modal ventana emergente de Edición */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-white/80 bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-black">Editar meta</h2>
              <form onSubmit={handleUpdateMeta} className="space-y-4">
                {/* Campo Título */}
                <div className="flex flex-col text-left">
                  <label className="text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input
                    type="text"
                    name="titulo"
                    defaultValue={editingItem.titulo}
                    className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                {/* Campo Descripción de la Meta */}
                <div className="flex flex-col text-left">
                  <label className="text-sm font-medium text-gray-700 mb-1">Descripción de la Meta</label>
                  <input
                    type="text"
                    name="descripcion"
                    defaultValue={editingItem.descripcion}
                    className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                {/* Campo Monto Objetivo */}
                <div className="flex flex-col text-left">
                  <label className="text-sm font-medium text-gray-700 mb-1">Valor</label>
                  <input
                    type="number"
                    name="valor"
                    defaultValue={editingItem.valor}
                    className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                {/* Botones Guardar y Cancelar */}
                <div className="flex flex-col gap-2">
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 transition text-white font-semibold px-6 py-3 rounded-full"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="w-full bg-red-500 hover:bg-red-600 transition text-white font-semibold px-6 py-3 rounded-full"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Modal ventana emergente de Confirmación de Eliminación */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-white/80 bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-black">Confirmar eliminación</h2>
              <p className="text-base text-gray-700 mb-6">
                ¿Estás seguro de que deseas eliminar esta meta? Esta acción no se puede deshacer.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={confirmDelete}
                  className="w-full bg-red-500 hover:bg-red-600 transition text-white font-semibold px-6 py-3 rounded-full"
                >
                  Sí, eliminar
                </button>
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="w-full bg-gray-500 hover:bg-gray-600 transition text-white font-semibold px-6 py-3 rounded-full"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Modal ventana emergente de Éxito al Crear */}
        {isSuccessModalOpen && (
          <div className="fixed inset-0 bg-white/80 bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-black text-center">
                ¡Meta creada con éxito!
              </h2>
              <p className="text-lg text-gray-800 text-center mb-6">
                La meta "<strong>{newMetaCreated?.titulo}</strong>" ha sido registrada correctamente.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={closeSuccessModal} 
                  className="bg-green-600 hover:bg-green-700 transition text-white font-semibold px-6 py-2 rounded-full"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}
        {isUpdateSuccessModalOpen && (
          <div className="fixed inset-0 bg-white/80 bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-black text-center">
                ¡Meta actualizada con éxito!
              </h2>
              <p className="text-lg text-gray-800 text-center mb-6">
                La meta "<strong>{updatedMeta?.titulo}</strong>" ha sido actualizada correctamente.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={closeUpdateSuccessModal} 
                  className="bg-green-600 hover:bg-green-700 transition text-white font-semibold px-6 py-2 rounded-full"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Pie de página */}
        <footer className="mt-12 bg-gray-50 text-center text-sm text-gray-500 py-6 border-t border-gray-200 w-full">
          <p className="text-xs">
            © {new Date().getFullYear()} FinanzasApp. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default MetasPages;