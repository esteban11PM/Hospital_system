import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { BaseFormPivoteComponent } from '../../../../Components/Base/base-form-pivote/base-form-pivote.component';
import { GameAssignmentService } from '../../../../Core/Services/System/game-assignment.service';
import { GameService } from '../../../../Core/Services/System/game.service';
import { GameStationService } from '../../../../Core/Services/System/gameStation.service';

@Component({
  selector: 'app-create-game-module',
  standalone: true,
  imports: [BaseFormPivoteComponent],
  templateUrl: './create-game-assignment.component.html',
  styleUrl: './create-game-assignment.component.css'
})
export class CreateGameAssignmentComponent implements OnInit {

	// Inyección de servicios propios del proyecto
  private readonly gameAssignmentService = inject(GameAssignmentService);
  private readonly gameService = inject(GameService);
  private readonly gameStationService = inject(GameStationService);

	// Inyección de servicios nativos de Angular
  private readonly router = inject(Router);

  selectFields: any[] = [];

  ngOnInit(): void {
    this.loadSelects();
  }

  private loadSelects(): void {
    forkJoin({
      games: this.gameService.getAll(),
      gameStations: this.gameStationService.getAll()
    }).subscribe({
      next: ({ games, gameStations }) => {
        this.selectFields = [
          {
            label: 'Game',
            controlName: 'gameId',
            options: games.map(game => ({ id: game.id, name: game.name }))
          },
          {
            label: 'GameStation',
            controlName: 'gameStationId',
            options: gameStations.map(gameStation => ({ id: gameStation.id, name: gameStation.name }))
          }
        ];
      },
      error: (err) => {
        console.error('Error al cargar games o gameStations:', err);
      }
    });
  }

  handleSaveGameAssignment(newGameAssignment: any): void {
    this.gameAssignmentService.create(newGameAssignment).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: `Game-Assignment creado ✅`,
          confirmButtonText: 'Aceptar'
        });
        this.router.navigate(['/system/gameassignment']);
      },
      error: (err) => {
        console.log('Error al crear GameAssignment:', err);
        const mensajeCompleto = err?.error?.message || 'Ocurrio un error inesperado.';
        const mensaje = mensajeCompleto.split(':')[1]?.trim() || mensajeCompleto;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensaje,
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }
}
