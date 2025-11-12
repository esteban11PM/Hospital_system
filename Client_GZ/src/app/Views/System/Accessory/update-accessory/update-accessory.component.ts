import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BaseFormEntityComponent } from '../../../../Components/Base/base-form-entity/base-form-entity.component';
import { AccessoryMod } from '../../../../Core/Models/System/AccessoryMod.model';
import { AccessoryService } from '../../../../Core/Services/System/accessory.service';

@Component({
	selector: 'app-update-accessory',
	standalone: true,
	imports: [BaseFormEntityComponent],
	templateUrl: './update-accessory.component.html',
	styleUrl: './update-accessory.component.css'
})
export class UpdateAccessoryComponent {

	// Inyección de servicios propios del proyecto
	private readonly accessoryService = inject(AccessoryService);

	// Inyección de servicios nativos de Angular
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);

	accessory: AccessoryMod | null = null;

	ngOnInit(): void {
		const accessoryId = Number(this.route.snapshot.paramMap.get('id'));
		this.accessoryService.getById(accessoryId).subscribe({
			next: (data) => this.accessory = data,
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

	handleSaveAccessory(updatedAccessory: AccessoryMod): void {
		if (!updatedAccessory.id) return;
		// console.log(updatedAccessory)
		this.accessoryService.update(updatedAccessory).subscribe({
			next: () => {
				Swal.fire({
					icon: 'success',
					title: `Actualizacion de ${updatedAccessory.name} ✅`,
					confirmButtonText: 'Aceptar'
				})
				this.router.navigate(['/system/accessory']);
			},
			error: (err) => {
				console.log('Error al actualizar Accessory:', err);
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
