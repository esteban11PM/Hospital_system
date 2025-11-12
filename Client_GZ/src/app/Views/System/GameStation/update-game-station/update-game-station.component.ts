import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BaseFormEntityComponent } from '../../../../Components/Base/base-form-entity/base-form-entity.component';
import { GameStationMod } from '../../../../Core/Models/System/GameStationMod.model';
import { GameStationService } from '../../../../Core/Services/System/gameStation.service';

@Component({
	selector: 'app-update-game-station',
	standalone: true,
	imports: [BaseFormEntityComponent],
	templateUrl: './update-game-station.component.html',
	styleUrl: './update-game-station.component.css'
})
export class UpdateGameStationComponent {

	// Inyección de servicios propios del proyecto
	private readonly gameStationService = inject(GameStationService);

	// Inyección de servicios
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);

	gameStation: GameStationMod | null = null;

	ngOnInit(): void {
		const gameStationId = Number(this.route.snapshot.paramMap.get('id'));
		this.gameStationService.getById(gameStationId).subscribe({
			next: (data) => this.gameStation = data,
			error: (err) => {
				console.log('Error al obtener Datos:', err);
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

	handleSaveGameStation(updatedGameStation: GameStationMod): void {
		if (!updatedGameStation.id) return;
		// console.log(updatedGameStation)
		this.gameStationService.update(updatedGameStation).subscribe({
			next: () => {
				Swal.fire({
					icon: 'success',
					title: `Actualizacion de ${updatedGameStation.name} ✅`,
					confirmButtonText: 'Aceptar'
				})
				this.router.navigate(['/system/gamestation']);
			},
			error: (err) => {
				console.log('Error al actualizar GameStation:', err);
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
}
