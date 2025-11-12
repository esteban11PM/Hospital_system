import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { BaseTableComponent } from '../../../../Components/Base/base-table/base-table.component';
import { GameMod } from '../../../../Core/Models/System/GameMod.model';
import { GameService } from '../../../../Core/Services/System/game.service';

@Component({
	selector: 'app-indice-game',
	standalone: true,
	imports: [MatCardModule, BaseTableComponent, MatButtonModule, MatIconModule, RouterLink],
	templateUrl: './indice-game.component.html',
	styleUrl: './indice-game.component.css'
})
export class IndiceGameComponent implements OnInit {

	// Inyección de servicios propios del proyecto
	private readonly gameService = inject(GameService);

	// Inyección de servicios nativos de Angular
	private readonly router = inject(Router)

	gameData : GameMod[] = [];
	columnasMostrar : string[] = [
		'N°', 'name', 'description', 'active'
	];

	ngOnInit(): void {
		this.cargarGames();
	}

	cargarGames(): void {
		this.gameService.getAllJWT().subscribe({
			next: (data) => {
				this.gameData = data;
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

	eliminarGame(game: GameMod): void {
		Swal.fire({
			title: '¿Qué tipo de eliminación deseas?',
			text: `Game: ${game.name}`,
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
				this.gameService.delete(game.id, 0).subscribe(() => {
					Swal.fire('Eliminacion Logica ✅', '', 'success');
					this.cargarGames();
				});
			} else if (result.isDenied) {
				this.gameService.delete(game.id, 1).subscribe(() => {
					Swal.fire('Eliminacion Permanente ✅', '', 'success');
					this.cargarGames();
				});
			}
		});
	}

	editarGame(game: GameMod): void {
		this.router.navigate([`/system/game/update/${game.id}`]);
	}
}
