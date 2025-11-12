import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  // Alertas de éxito
  success(title: string, text: string = '') {
    return Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonColor: '#28a745',
      timer: 3000,
      timerProgressBar: true
    });
  }

  // Alertas de error
  error(title: string, text: string = '') {
    return Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonColor: '#dc3545'
    });
  }

  // Alertas de advertencia
  warning(title: string, text: string = '') {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      confirmButtonColor: '#ffc107',
      confirmButtonText: 'Entendido'
    });
  }

  // Alertas de información
  info(title: string, text: string = '') {
    return Swal.fire({
      title,
      text,
      icon: 'info',
      confirmButtonColor: '#17a2b8'
    });
  }

  // Confirmación de eliminación
  confirmDelete(title: string = '¿Estás seguro?', text: string = 'Esta acción no se puede deshacer') {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
  }

  // Confirmación genérica
  confirm(title: string, text: string = '', confirmText: string = 'Confirmar') {
    return Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#6c757d',
      confirmButtonText: confirmText,
      cancelButtonText: 'Cancelar'
    });
  }

  // Loading
  loading(title: string = 'Cargando...', text: string = 'Por favor espera') {
    return Swal.fire({
      title,
      text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  // Cerrar alerta
  close() {
    Swal.close();
  }
}