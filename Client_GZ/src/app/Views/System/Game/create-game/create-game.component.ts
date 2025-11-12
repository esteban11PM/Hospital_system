import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BaseFormEntityComponent } from '../../../../Components/Base/base-form-entity/base-form-entity.component';
import { GameMod } from '../../../../Core/Models/System/GameMod.model';
import { GameService } from '../../../../Core/Services/System/game.service';

@Component({
	selector: 'app-create-game',
	standalone: true,
	imports: [BaseFormEntityComponent],
	templateUrl: './create-game.component.html',
	styleUrl: './create-game.component.css'
})
export class CreateGameComponent {

	// Inyección de servicios propios del proyecto
	private readonly gameService = inject(GameService);

	// Inyección de servicios nativos de Angular
	private readonly router = inject(Router);

	handleSaveGame(newGame: GameMod): void {
		// console.log(newGame)
		this.gameService.create(newGame).subscribe({
			next: () => {
				Swal.fire({
					icon: 'success',
					title: `Creacion de ${newGame.name} ✅`,
					confirmButtonText: 'Aceptar'
				})
				this.router.navigate(['/system/game']);
			},
			error: (err) => {
				console.log('Error al crear Game:', err);
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
