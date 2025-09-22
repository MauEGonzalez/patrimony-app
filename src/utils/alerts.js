import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Un tema oscuro base para todas nuestras alertas
const swalTheme = {
  background: '#1f2937', // bg-gray-800
  color: '#d1d5db',     // text-gray-300
  confirmButtonColor: '#0ea5e9', // text-sky-500
  cancelButtonColor: '#ef4444',  // text-red-500
};

/**
 * Muestra una alerta de éxito simple.
 * @param {string} title - El título de la alerta.
 */
export const showSuccessAlert = (title) => {
  MySwal.fire({
    ...swalTheme,
    title,
    icon: 'success',
    timer: 1500,
    showConfirmButton: false,
  });
};

/**
 * Muestra una alerta de error simple.
 * @param {string} title - El título del error.
 * @param {string} text - El texto descriptivo del error.
 */
export const showErrorAlert = (title, text) => {
  MySwal.fire({
    ...swalTheme,
    title,
    text,
    icon: 'error',
  });
};

/**
 * Muestra un diálogo de confirmación.
 * @param {string} title - El título de la pregunta de confirmación.
 * @param {string} text - El texto descriptivo.
 * @returns {Promise<import('sweetalert2').SweetAlertResult>} - El resultado de la interacción del usuario.
 */
export const showConfirmDialog = (title, text) => {
  return MySwal.fire({
    ...swalTheme,
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'No, cancelar',
    reverseButtons: true,
  });
};