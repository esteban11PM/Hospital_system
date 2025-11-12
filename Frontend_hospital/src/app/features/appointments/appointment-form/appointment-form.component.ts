import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppointmentService } from '../../../core/services/appointment.service';
import { PatientService } from '../../../core/services/patient.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { ConsultingRoomService } from '../../../core/services/consulting-room.service';
import { SpecialtyService } from '../../../core/services/specialty.service';
import { AlertService } from '../../../core/services/alert.service';
import { Appointment, Patient, Doctor, ConsultingRoom, Specialty } from '../../../core/models/medical.models';

@Component({
  selector: 'app-appointment-form',
  standalone: false,
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss']
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  title = '';

  patients: Patient[] = [];
  doctors: Doctor[] = [];
  consultingRooms: ConsultingRoom[] = [];
  specialties: Specialty[] = [];

  statusOptions = [
    { value: 'Pending', label: 'Pendiente' },
    { value: 'Confirmed', label: 'Confirmada' },
    { value: 'Cancelled', label: 'Cancelada' },
    { value: 'Completed', label: 'Completada' }
  ];

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private consultingRoomService: ConsultingRoomService,
    private specialtyService: SpecialtyService,
    private alertService: AlertService,
    private dialogRef: MatDialogRef<AppointmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: string; appointment?: Appointment }
  ) {
    this.appointmentForm = this.fb.group({
      appointmentDate: ['', Validators.required],
      notes: [''],
      status: ['Pending', Validators.required],
      patientId: ['', Validators.required],
      doctorId: ['', Validators.required],
      consultingRoomId: ['', Validators.required],
      specialtyId: ['', Validators.required],
      active: [true]
    });

    this.isEditMode = data.mode === 'edit';
    this.title = this.isEditMode ? 'Editar Cita' : 'Nueva Cita';

    if (this.isEditMode && data.appointment) {
      this.appointmentForm.patchValue({
        ...data.appointment,
        appointmentDate: new Date(data.appointment.appointmentDate)
      });
    }
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.patientService.getPatients().subscribe({
      next: (response) => {
        this.patients = response || [];
      },
      error: (error) => console.error('Error loading patients:', error)
    });

    this.doctorService.getDoctors().subscribe({
      next: (response) => {
        this.doctors = response || [];
      },
      error: (error) => console.error('Error loading doctors:', error)
    });

    this.consultingRoomService.getConsultingRooms().subscribe({
      next: (response) => {
        this.consultingRooms = response || [];
      },
      error: (error) => console.error('Error loading consulting rooms:', error)
    });

    this.specialtyService.getSpecialties().subscribe({
      next: (response) => {
        this.specialties = response || [];
      },
      error: (error) => console.error('Error loading specialties:', error)
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      this.isLoading = true;

      const appointmentData: any = {
        ...this.appointmentForm.value,
        appointmentDate: new Date(this.appointmentForm.value.appointmentDate).toISOString()
      };

      const operation = this.isEditMode
        ? this.appointmentService.updateAppointment({ ...appointmentData, id: this.data.appointment!.id })
        : this.appointmentService.createAppointment(appointmentData);

      operation.subscribe({
        next: (response) => {
          this.alertService.success(
            this.isEditMode ? 'Actualizada' : 'Creada',
            `Cita ${this.isEditMode ? 'actualizada' : 'creada'} correctamente`
          );
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error saving appointment:', error);
          this.alertService.error(
            'Error',
            `No se pudo ${this.isEditMode ? 'actualizar' : 'crear'} la cita`
          );
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.appointmentForm.controls).forEach(key => {
      const control = this.appointmentForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.appointmentForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    return '';
  }
}