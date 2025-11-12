import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BaseFormEntityComponent } from '../../../../Components/Base/base-form-entity/base-form-entity.component';
import { GameStationMod } from '../../../../Core/Models/System/GameStationMod.model';
import { GameStationService } from '../../../../Core/Services/System/gameStation.service';

@Component({
	selector: 'app-create-game-station',
	standalone: true,
	imports: [BaseFormEntityComponent],
	templateUrl: './create-game-station.component.html',
	styleUrl: './create-game-station.component.css'
})
export class CreateGameStationComponent {

	// Inyección de servicios propios del proyecto
	private readonly gameStationService = inject(GameStationService);

	// Inyección de servicios nativos de Angular
	private readonly router = inject(Router);

	handleSaveGameStation(newGameStation: GameStationMod): void {
		// console.log(newGameStation)
		this.gameStationService.create(newGameStation).subscribe({
			next: () => {
				Swal.fire({
					icon: 'success',
					title: `Creacion de ${newGameStation.name} ✅`,
					confirmButtonText: 'Aceptar'
				})
				this.router.navigate(['/system/gamestation']);
			},
			error: (err) => {
				console.log('Error al crear GameStation:', err);
				const mensajeCompleto = err?.error?.message || 'Ocurrio un error inesperado.';
				const mensaje = mensajeCompleto.split(':')[1]?.trim() || mensajeCompleto;
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: mensaje,
					confirmButtonText: 'Aceptar'
				});;
			}
		});
	}
}
