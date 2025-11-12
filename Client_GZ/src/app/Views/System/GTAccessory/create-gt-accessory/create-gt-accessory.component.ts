import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { BaseFormPivoteComponent } from '../../../../Components/Base/base-form-pivote/base-form-pivote.component';
import { GameStationAccessoryService } from '../../../../Core/Services/System/gameStation-accessory.service';
import { GameStationService } from '../../../../Core/Services/System/gameStation.service';
import { AccessoryService } from '../../../../Core/Services/System/accessory.service';

@Component({
	selector: 'app-create-gt-module',
	standalone: true,
	imports: [BaseFormPivoteComponent],
	templateUrl: './create-gt-accessory.component.html',
	styleUrl: './create-gt-accessory.component.css'
})
export class CreateGtAccessoryComponent implements OnInit {

	// Inyección de servicios propios del proyecto
	private readonly gameStationService = inject(GameStationService);
	private readonly accessoryService = inject(AccessoryService);
	private readonly gtAccessoryService = inject(GameStationAccessoryService);

	// Inyección de servicios nativos de Angular
	private readonly router = inject(Router);

	selectFields: any[] = [];

	ngOnInit(): void {
		this.loadSelects();
	}

	private loadSelects(): void {
		forkJoin({
			gt: this.gameStationService.getAll(),
			accessory: this.accessoryService.getAll()
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

	handleSaveGTAccessory(newGTAccessory: any): void {
		this.gtAccessoryService.create(newGTAccessory).subscribe({
			next: () => {
				Swal.fire({
					icon: 'success',
					title: `GameStation-Accessory creado ✅`,
					confirmButtonText: 'Aceptar'
				});
				this.router.navigate(['/system/gamestationaccessory']);
			},
			error: (err) => {
				console.log('Error al crear GameStationAccessory:', err);
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
