import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PatientService } from '../../../core/services/patient.service';
import { AlertService } from '../../../core/services/alert.service';
import { Patient } from '../../../core/models/medical.models';

@Component({
  selector: 'app-patient-form',
  standalone: false,
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent implements OnInit {
  patientForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  title = '';

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private alertService: AlertService,
    private dialogRef: MatDialogRef<PatientFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: string; patient?: Patient }
  ) {
    this.patientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      active: [true]
    });

    this.isEditMode = data.mode === 'edit';
    this.title = this.isEditMode ? 'Editar Paciente' : 'Nuevo Paciente';

    if (this.isEditMode && data.patient) {
      this.patientForm.patchValue(data.patient);
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.patientForm.valid) {
      this.isLoading = true;

      const patientData: Patient = this.patientForm.value;

      const operation = this.isEditMode
        ? this.patientService.updatePatient({ ...patientData, id: this.data.patient!.id })
        : this.patientService.createPatient(patientData);

      operation.subscribe({
        next: (response) => {
          this.alertService.success(
            this.isEditMode ? 'Actualizado' : 'Creado',
            `Paciente ${this.isEditMode ? 'actualizado' : 'creado'} correctamente`
          );
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error saving patient:', error);
          this.alertService.error(
            'Error',
            `No se pudo ${this.isEditMode ? 'actualizar' : 'crear'} el paciente`
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
    Object.keys(this.patientForm.controls).forEach(key => {
      const control = this.patientForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.patientForm.get(fieldName);
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