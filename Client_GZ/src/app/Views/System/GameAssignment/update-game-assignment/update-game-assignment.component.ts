import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { BaseFormPivoteComponent } from '../../../../Components/Base/base-form-pivote/base-form-pivote.component';
import { GameAssignmentMod } from '../../../../Core/Models/System/GameAssignmentMod.model';
import { GameAssignmentService } from '../../../../Core/Services/System/game-assignment.service';
import { GameService } from '../../../../Core/Services/System/game.service';
import { GameStationService } from '../../../../Core/Services/System/gameStation.service';

@Component({
  selector: 'app-update-game-assignment',
  standalone: true,
  imports: [BaseFormPivoteComponent, CommonModule],
  templateUrl: './update-game-assignment.component.html',
  styleUrl: './update-game-assignment.component.css'
})
export class UpdateGameAssignmentComponent implements OnInit {

	// Inyección de servicios propios del proyecto
  private readonly gameService = inject(GameService);
  private readonly gameStationService = inject(GameStationService);
  private readonly gameAssignmentService = inject(GameAssignmentService);

	// Inyección de servicios nativos de Angular
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  entity!: GameAssignmentMod;
  selectFields: any[] = [];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/system/gameassignment']);
      return;
    }

    this.gameAssignmentService.getById(id).subscribe({
      next: (data) => {
        this.entity = data;
        this.loadSelects();
      },
      error: (err) => {
        console.log('Error al Obtener GameAssignment:', err);
        const mensajeCompleto = err?.error?.message || 'Ocurrio un error inesperado.';
        const mensaje = mensajeCompleto.split(':')[1]?.trim() || mensajeCompleto;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensaje,
          confirmButtonText: 'Cerrar'
        })
      }
    });
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

  handleUpdateGameAssignment(data: any): void {
    this.gameAssignmentService.update(data).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Game-Station actualizado ✅',
          confirmButtonText: 'Aceptar'
        });
        this.router.navigate(['/system/gameassignment']);
      },
      error: (err) => {
        console.log('Error al actualizar GameAssignment:', err);
        const mensajeCompleto = err?.error?.message || 'Ocurrio un error inesperado.';
        const mensaje = mensajeCompleto.split(':')[1]?.trim() || mensajeCompleto;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensaje,
          confirmButtonText: 'Cerrar'
        })
      }
    });
  }
}
