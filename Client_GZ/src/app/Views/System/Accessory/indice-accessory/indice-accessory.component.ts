import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { BaseTableComponent } from '../../../../Components/Base/base-table/base-table.component';
import { AccessoryMod } from '../../../../Core/Models/System/AccessoryMod.model';
import { AccessoryService } from '../../../../Core/Services/System/accessory.service';

@Component({
	selector: 'app-indice-accessory',
	standalone: true,
	imports: [MatCardModule, BaseTableComponent, MatButtonModule, MatIconModule, RouterLink],
	templateUrl: './indice-accessory.component.html',
	styleUrl: './indice-accessory.component.css'
})
export class IndiceAccessoryComponent implements OnInit {

	// Inyección de servicios propios del proyecto
	private readonly accessoryService = inject(AccessoryService);

	// Inyección de servicios nativos de Angular
	private readonly router = inject(Router)

	accessoryData : AccessoryMod[] = [];
	columnasMostrar : string[] = [
		'N°', 'name', 'description', 'active'
	];

	ngOnInit(): void {
		this.cargarAccessorys();
	}

	cargarAccessorys(): void {
		this.accessoryService.getAllJWT().subscribe({
			next: (data) => {
				this.accessoryData = data;
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

	eliminarAccessory(accessory: AccessoryMod): void {
		Swal.fire({
			title: '¿Qué tipo de eliminación deseas?',
			text: `Accessory: ${accessory.name}`,
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
				this.accessoryService.delete(accessory.id, 0).subscribe(() => {
					Swal.fire('Eliminacion Logica ✅', '', 'success');
					this.cargarAccessorys();
				});
			} else if (result.isDenied) {
				this.accessoryService.delete(accessory.id, 1).subscribe(() => {
					Swal.fire('Eliminacion Permanente ✅', '', 'success');
					this.cargarAccessorys();
				});
			}
		});
	}

	editarAccessory(accessory: AccessoryMod): void {
		this.router.navigate([`/system/accessory/update/${accessory.id}`]);
	}
}
