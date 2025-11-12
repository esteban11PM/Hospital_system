export interface Patient {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  active: boolean;
}

export interface Doctor {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  licenseNumber: string;
  active: boolean;
}

export interface Appointment {
  id: number;
  appointmentDate: Date;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  patientId: number;
  doctorId: number;
  consultingRoomId: number;
  specialtyId: number;
  active: boolean;

  // Propiedades de navegación
  patient?: Patient;
  doctor?: Doctor;
  consultingRoom?: ConsultingRoom;
  specialty?: Specialty;
}

export interface Specialty {
  id: number;
  name: string;
  description?: string;
  active: boolean;
}

export interface ConsultingRoom {
  id: number;
  name: string;
  description?: string;
  active: boolean;
}