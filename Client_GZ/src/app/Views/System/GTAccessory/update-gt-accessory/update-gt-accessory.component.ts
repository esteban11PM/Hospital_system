import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { BaseFormPivoteComponent } from '../../../../Components/Base/base-form-pivote/base-form-pivote.component';
import { GameStationAccessoryMod } from '../../../../Core/Models/System/GameStationAccessoryMod.model';
import { GameStationAccessoryService } from '../../../../Core/Services/System/gameStation-accessory.service';
import { GameStationService } from '../../../../Core/Services/System/gameStation.service';
import { AccessoryService } from '../../../../Core/Services/System/accessory.service';

@Component({
	selector: 'app-update-gt-accessory',
	standalone: true,
	imports: [BaseFormPivoteComponent, CommonModule],
	templateUrl: './update-gt-accessory.component.html',
	styleUrl: './update-gt-accessory.component.css'
})
export class UpdateGtAccessoryComponent implements OnInit {

	// Inyección de servicios propios del proyecto
	private readonly gtService = inject(GameStationService);
	private readonly accessoyService = inject(AccessoryService);
	private readonly gtAccessoryService = inject(GameStationAccessoryService);

	// Inyección de servicios nativos de Angular
	private readonly route = inject(ActivatedRoute);
	private readonly router = inject(Router);

	entity!: GameStationAccessoryMod;
	selectFields: any[] = [];

	ngOnInit(): void {
		const id = Number(this.route.snapshot.paramMap.get('id'));
		if (!id) {
			this.router.navigate(['/system/gamestationaccessory']);
			return;
		}

		this.gtAccessoryService.getById(id).subscribe({
			next: (data) => {
				this.entity = data;
				this.loadSelects();
			},
			error: (err) => {
				console.log('Error al Obtener GameStationAccessory:', err);
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
			gt: this.gtService.getAll(),
			accessory: this.accessoyService.getAll()
		}).subscribe({
			next: ({ gt, accessory }) => {
				this.selectFields = [
					{
						label: 'GameStation',
						controlName: 'gameStationId',
						options: gt.map(gt => ({ id: gt.id, name: gt.name }))
					},
					{
						label: 'Accessory',
						controlName: 'accessoryId',
						options: accessory.map(accessory => ({ id: accessory.id, name: accessory.name }))
					}
				];
			},
			error: (err) => {
				console.error('Error al cargar GameStations o Accessories:', err);
			}
		});
	}

	handleUpdateGTAccessory(data: any): void {
		this.gtAccessoryService.update(data).subscribe({
			next: () => {
				Swal.fire({
					icon: 'success',
					title: 'GameStation-Station actualizado ✅',
					confirmButtonText: 'Aceptar'
				});
				this.router.navigate(['/system/gamestationaccessory']);
			},
			error: (err) => {
				console.log('Error al actualizar GtAccessory:', err);
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
