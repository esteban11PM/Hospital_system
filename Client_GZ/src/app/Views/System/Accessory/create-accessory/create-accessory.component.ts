import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BaseFormEntityComponent } from '../../../../Components/Base/base-form-entity/base-form-entity.component';
import { AccessoryMod } from '../../../../Core/Models/System/AccessoryMod.model';
import { AccessoryService } from '../../../../Core/Services/System/accessory.service';

@Component({
	selector: 'app-create-accessory',
	standalone: true,
	imports: [BaseFormEntityComponent],
	templateUrl: './create-accessory.component.html',
	styleUrl: './create-accessory.component.css'
})
export class CreateAccessoryComponent {

	// Inyección de servicios propios del proyecto
	private readonly accessoryService = inject(AccessoryService);

	// Inyección de servicios nativos de Angular
	private readonly router = inject(Router);

	handleSaveAccessory(newAccessory: AccessoryMod): void {
		// console.log(newAccessory)
		this.accessoryService.create(newAccessory).subscribe({
			next: () => {
				Swal.fire({
					icon: 'success',
					title: `Creacion de ${newAccessory.name} ✅`,
					confirmButtonText: 'Aceptar'
				})
				this.router.navigate(['/system/accessory']);
			},
			error: (err) => {
				console.log('Error al crear Accessory:', err);
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
