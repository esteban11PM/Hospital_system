import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DoctorService } from '../../../core/services/doctor.service';
import { AlertService } from '../../../core/services/alert.service';
import { Doctor } from '../../../core/models/medical.models';

@Component({
  selector: 'app-doctor-form',
  standalone: false,
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.scss']
})
export class DoctorFormComponent implements OnInit {
  doctorForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  title = '';

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private alertService: AlertService,
    private dialogRef: MatDialogRef<DoctorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: string; doctor?: Doctor }
  ) {
    this.doctorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      licenseNumber: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      active: [true]
    });

    this.isEditMode = data.mode === 'edit';
    this.title = this.isEditMode ? 'Editar Doctor' : 'Nuevo Doctor';

    if (this.isEditMode && data.doctor) {
      this.doctorForm.patchValue(data.doctor);
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.doctorForm.valid) {
      this.isLoading = true;

      const doctorData: Doctor = this.doctorForm.value;

      const operation = this.isEditMode
        ? this.doctorService.updateDoctor({ ...doctorData, id: this.data.doctor!.id })
        : this.doctorService.createDoctor(doctorData);

      operation.subscribe({
        next: (response) => {
          this.alertService.success(
            this.isEditMode ? 'Actualizado' : 'Creado',
            `Doctor ${this.isEditMode ? 'actualizado' : 'creado'} correctamente`
          );
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error saving doctor:', error);
          this.alertService.error(
            'Error',
            `No se pudo ${this.isEditMode ? 'actualizar' : 'crear'} el doctor`
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
    Object.keys(this.doctorForm.controls).forEach(key => {
      const control = this.doctorForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.doctorForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('email')) {
      return 'Email inválido';
    }
    if (control?.hasError('minlength')) {
      return `Mínimo ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (control?.hasError('maxlength')) {
      return `Máximo ${control.errors?.['maxlength'].requiredLength} caracteres`;
    }
    if (control?.hasError('pattern')) {
      return 'Formato inválido';
    }
    return '';
  }
}