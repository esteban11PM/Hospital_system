import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DoctorService } from '../../../core/services/doctor.service';
import { AlertService } from '../../../core/services/alert.service';
import { Doctor } from '../../../core/models/medical.models';
import { DoctorFormComponent } from '../doctor-form/doctor-form.component';

@Component({
  selector: 'app-doctor-list',
  standalone: false,
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.scss']
})
export class DoctorListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'lastName', 'email', 'licenseNumber', 'actions'];
  dataSource = new MatTableDataSource<Doctor>();
  isLoading = false;

  constructor(
    private doctorService: DoctorService,
    private alertService: AlertService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.isLoading = true;
    this.doctorService.getDoctors().subscribe({
      next: (response) => {
        this.dataSource.data = response || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.alertService.error('Error', 'No se pudieron cargar los doctores');
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(DoctorFormComponent, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDoctors();
      }
    });
  }

  openEditDialog(doctor: Doctor): void {
    const dialogRef = this.dialog.open(DoctorFormComponent, {
      width: '600px',
      data: { mode: 'edit', doctor }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDoctors();
      }
    });
  }

  deleteDoctor(doctor: Doctor): void {
    this.alertService.confirmDelete(
      '¿Eliminar doctor?',
      `¿Estás seguro de eliminar al doctor ${doctor.name} ${doctor.lastName}?`
    ).then((result: any) => {
      if (result.isConfirmed) {
        this.doctorService.deleteDoctor(doctor.id).subscribe({
          next: () => {
            this.alertService.success('Eliminado', 'Doctor eliminado correctamente');
            this.loadDoctors();
          },
          error: (error) => {
            console.error('Error deleting doctor:', error);
            this.alertService.error('Error', 'No se pudo eliminar el doctor');
          }
        });
      }
    });
  }
}