import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { PatientService } from '../../../core/services/patient.service';
import { AlertService } from '../../../core/services/alert.service';
import { Patient } from '../../../core/models/medical.models';
import { PatientFormComponent } from '../patient-form/patient-form.component';

@Component({
  selector: 'app-patient-list',
  standalone: false,
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'lastName', 'email', 'phone', 'actions'];
  dataSource = new MatTableDataSource<Patient>();
  isLoading = false;

  constructor(
    private patientService: PatientService,
    private alertService: AlertService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.isLoading = true;
    this.patientService.getPatients().subscribe({
      next: (response) => {
        this.dataSource.data = response || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        this.alertService.error('Error', 'No se pudieron cargar los pacientes');
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(PatientFormComponent, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPatients();
      }
    });
  }

  openEditDialog(patient: Patient): void {
    const dialogRef = this.dialog.open(PatientFormComponent, {
      width: '600px',
      data: { mode: 'edit', patient }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPatients();
      }
    });
  }

  deletePatient(patient: Patient): void {
    this.alertService.confirmDelete(
      '¿Eliminar paciente?',
      `¿Estás seguro de eliminar al paciente ${patient.name} ${patient.lastName}?`
    ).then((result: any) => {
      if (result.isConfirmed) {
        this.patientService.deletePatient(patient.id).subscribe({
          next: () => {
            this.alertService.success('Eliminado', 'Paciente eliminado correctamente');
            this.loadPatients();
          },
          error: (error) => {
            console.error('Error deleting patient:', error);
            this.alertService.error('Error', 'No se pudo eliminar el paciente');
          }
        });
      }
    });
  }
}