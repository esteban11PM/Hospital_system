import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { BaseTableComponent } from '../../../../Components/Base/base-table/base-table.component';
import { GameStationAccessoryMod } from '../../../../Core/Models/System/GameStationAccessoryMod.model';
import { GameStationAccessoryService } from '../../../../Core/Services/System/gameStation-accessory.service';

@Component({
  selector: 'app-indice-gt-accessory',
  standalone: true,
  imports: [MatCardModule, BaseTableComponent, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './indice-gt-accessory.component.html',
  styleUrl: './indice-gt-accessory.component.css'
})
export class IndiceGtAccessoryComponent implements OnInit {

	// Inyección de servicios propios del proyecto
  private readonly gtAccessoryService = inject(GameStationAccessoryService);

	// Inyección de servicios nativos de Angular
  private readonly router = inject(Router)

  gtAccessoryData : GameStationAccessoryMod[] = [];
  columnasMostrar : string[] = [
    'N°', 'gameStationName', 'accessoryName', 'active'
  ];

  ngOnInit(): void {
    this.cargarGtAccessorys();
  }

  cargarGtAccessorys(): void {
    this.gtAccessoryService.getAllJWT().subscribe({
      next: (data) => {
        this.gtAccessoryData = data;
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

  eliminarGTAccessory(gtAccessory: GameStationAccessoryMod): void {
    Swal.fire({
      title: '¿Qué tipo de eliminación deseas?',
      text: `GtAccessory`,
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
        this.gtAccessoryService.delete(gtAccessory.id, 0).subscribe(() => {
          Swal.fire('Eliminacion Logica ✅', '', 'success');
          this.cargarGtAccessorys();
        });
      } else if (result.isDenied) {
        this.gtAccessoryService.delete(gtAccessory.id, 1).subscribe(() => {
          Swal.fire('Eliminacion Permanente ✅', '', 'success');
          this.cargarGtAccessorys();
        });
      }
    });
  }

  editarGTAccessory(gtAccessory: GameStationAccessoryMod): void {
    this.router.navigate([`/system/gamestationaccessory/update/${gtAccessory.id}`]);
  }
}
