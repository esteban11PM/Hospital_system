import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { BaseTableComponent } from '../../../../Components/Base/base-table/base-table.component';
import { GameAssignmentMod } from '../../../../Core/Models/System/GameAssignmentMod.model';
import { GameAssignmentService } from '../../../../Core/Services/System/game-assignment.service';

@Component({
  selector: 'app-indice-game-assignment',
  standalone: true,
  imports: [MatCardModule, BaseTableComponent, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './indice-game-assignment.component.html',
  styleUrl: './indice-game-assignment.component.css'
})
export class IndiceGameAssignmentComponent implements OnInit {

	// Inyección de servicios propios del proyecto
  private readonly gameAssignmentService = inject(GameAssignmentService);

	// Inyección de servicios nativos de Angular
  private readonly router = inject(Router)

  gameAssignmentData : GameAssignmentMod[] = [];
  columnasMostrar : string[] = [
    'N°', 'gameName', 'gameStationName', 'active'
  ];

  ngOnInit(): void {
    this.cargarGameAssignments();
  }

  cargarGameAssignments(): void {
    this.gameAssignmentService.getAllJWT().subscribe({
      next: (data) => {
        this.gameAssignmentData = data;
      },
      error: (err) => {
        console.log('Error al cargar los datos:', err);
        const mensajeCompleto = err?.error?.message || 'Ocurrio un error inesperado.';
        const mensaje = mensajeCompleto.split(':')[1]?.trim() || mensajeCompleto;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensaje,
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  eliminarGameAssignment(gameAssignment: GameAssignmentMod): void {
    Swal.fire({
      title: '¿Qué tipo de eliminación deseas?',
      text: `GameAssignment`,
      icon: 'warning',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Lógica',
      denyButtonText: 'Permanente',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      denyButtonColor: '#d33',
    }).then(result => {
      if (result.isConfirmed) {
        this.gameAssignmentService.delete(gameAssignment.id, 0).subscribe(() => {
          Swal.fire('Eliminacion Logica ✅', '', 'success');
          this.cargarGameAssignments();
        });
      } else if (result.isDenied) {
        this.gameAssignmentService.delete(gameAssignment.id, 1).subscribe(() => {
          Swal.fire('Eliminacion Permanente ✅', '', 'success');
          this.cargarGameAssignments();
        });
      }
    });
  }

  editarGameAssignment(gameAssignment: GameAssignmentMod): void {
    this.router.navigate([`/system/gameassignment/update/${gameAssignment.id}`]);
  }
}
