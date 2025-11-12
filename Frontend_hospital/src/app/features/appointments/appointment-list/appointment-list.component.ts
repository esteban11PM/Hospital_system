import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentService } from '../../../core/services/appointment.service';
import { AlertService } from '../../../core/services/alert.service';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { Appointment } from '../../../core/models/medical.models';

@Component({
  selector: 'app-appointment-list',
  standalone: false,
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'appointmentDate', 'patient', 'doctor', 'status', 'actions'];
  dataSource = new MatTableDataSource<Appointment>();
  isLoading = false;

  constructor(
    private appointmentService: AppointmentService,
    private alertService: AlertService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.appointmentService.getAppointments().subscribe({
      next: (response) => {
        this.dataSource.data = response || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Pending': 'Pendiente',
      'Confirmed': 'Confirmada',
      'Cancelled': 'Cancelada',
      'Completed': 'Completada'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'Pending': 'status-pending',
      'Confirmed': 'status-confirmed',
      'Cancelled': 'status-cancelled',
      'Completed': 'status-completed'
    };
    return classMap[status] || 'status-default';
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAppointments();
      }
    });
  }

  openEditDialog(appointment: Appointment): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '600px',
      data: { mode: 'edit', appointment }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAppointments();
      }
    });
  }

  deleteAppointment(appointment: Appointment): void {
    if (confirm(`¿Está seguro de que desea eliminar la cita de ${appointment.patient?.name} ${appointment.patient?.lastName}?`)) {
      this.appointmentService.deleteAppointment(appointment.id).subscribe({
        next: () => {
          this.alertService.success('Eliminada', 'Cita eliminada correctamente');
          this.loadAppointments();
        },
        error: (error) => {
          console.error('Error deleting appointment:', error);
          this.alertService.error('Error', 'No se pudo eliminar la cita');
        }
      });
    }
  }
}