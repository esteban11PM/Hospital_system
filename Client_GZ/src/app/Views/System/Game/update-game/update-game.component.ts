import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BaseFormEntityComponent } from '../../../../Components/Base/base-form-entity/base-form-entity.component';
import { GameMod } from '../../../../Core/Models/System/GameMod.model';
import { GameService } from '../../../../Core/Services/System/game.service';

@Component({
	selector: 'app-update-game',
	standalone: true,
	imports: [BaseFormEntityComponent],
	templateUrl: './update-game.component.html',
	styleUrl: './update-game.component.css'
})
export class UpdateGameComponent {

	// Inyección de servicios propios del proyecto
	private readonly gameService = inject(GameService);

	// Inyección de servicios nativos de Angular
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);

	game: GameMod | null = null;

	ngOnInit(): void {
		const gameId = Number(this.route.snapshot.paramMap.get('id'));
		this.gameService.getById(gameId).subscribe({
			next: (data) => this.game = data,
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

	handleSaveGame(updatedGame: GameMod): void {
		if (!updatedGame.id) return;
		// console.log(updatedGame)
		this.gameService.update(updatedGame).subscribe({
			next: () => {
				Swal.fire({
					icon: 'success',
					title: `Actualizacion de ${updatedGame.name} ✅`,
					confirmButtonText: 'Aceptar'
				})
				this.router.navigate(['/system/game']);
			},
			error: (err) => {
				console.log('Error al actualizar Game:', err);
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
