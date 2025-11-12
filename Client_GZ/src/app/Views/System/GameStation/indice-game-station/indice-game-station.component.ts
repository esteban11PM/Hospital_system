import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { BaseTableComponent } from '../../../../Components/Base/base-table/base-table.component';
import { GameStationMod } from '../../../../Core/Models/System/GameStationMod.model';
import { GameStationService } from '../../../../Core/Services/System/gameStation.service';

@Component({
	selector: 'app-indice-game-station',
	standalone: true,
	imports: [MatCardModule, BaseTableComponent, MatButtonModule, MatIconModule, RouterLink],
	templateUrl: './indice-game-station.component.html',
	styleUrl: './indice-game-station.component.css'
})
export class IndiceGameStationComponent implements OnInit {

	// Inyección de servicios propios del proyecto
	private readonly gameStationService = inject(GameStationService);

	// Inyección de servicios nativos de Angular
	private readonly router = inject(Router)

	gameStationData : GameStationMod[] = [];
	columnasMostrar : string[] = [
		'N°', 'name', 'description', 'active'
	];

	ngOnInit(): void {
		this.cargarGameStations();
	}

	cargarGameStations(): void {
		this.gameStationService.getAllJWT().subscribe({
			next: (data) => {
				this.gameStationData = data;
				// console.log(data);
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

	eliminarGameStation(gameStation: GameStationMod): void {
		Swal.fire({
			title: '¿Qué tipo de eliminación deseas?',
			text: `GameStation: ${gameStation.name}`,
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
				this.gameStationService.delete(gameStation.id, 0).subscribe(() => {
					Swal.fire('Eliminacion Logica ✅', '', 'success');
					this.cargarGameStations();
				});
			} else if (result.isDenied) {
				this.gameStationService.delete(gameStation.id, 1).subscribe(() => {
					Swal.fire('Eliminacion Permanente ✅', '', 'success');
					this.cargarGameStations();
				});
			}
		});
	}

	editarGameStation(gameStation: GameStationMod): void {
		this.router.navigate([`/system/gamestation/update/${gameStation.id}`]);
	}
}
