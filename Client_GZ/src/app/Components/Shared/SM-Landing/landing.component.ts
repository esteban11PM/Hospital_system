import { Component, inject, Renderer2 } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseProviderService } from '../../../Core/Services/database-provider.service';
import { AlertTotalService } from '../../../Core/Services/alert-total.service';

@Component({
	selector: 'app-landing',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		MatButtonModule,
		MatIconModule,
		MatCardModule,
		MatFormFieldModule,
		MatSelectModule
	],
	templateUrl: './landing.component.html',
	styleUrl: './landing.component.css'
})
export class SMLandingComponent {

	// Inyección de servicios propios del proyecto
	private readonly alertService = inject(AlertTotalService);

	// Variables de estado y control local
	selectedDatabase: string;
	isConnected: boolean = true;

	// Información de las bases de datos
	databases = {
		sqlserver: { name: 'SQL Server' },
		mysql: { name: 'MySQL' },
		postgresql: { name: 'PostgreSQL' }
	};

	// 2. Inyectar el servicio
	private dbProviderService = inject(DatabaseProviderService);

	constructor() {
		// 3. Inicializar el dropdown con el valor guardado
		this.selectedDatabase = this.dbProviderService.getProvider();
	}

	getDatabaseName(dbKey: string): string {
		return this.dbProviderService.getProvider() || dbKey;
	}

	onDatabaseChange(): void {
		// Esta función ahora puede estar vacía o hacer validaciones
		// La acción principal ocurre en changeDatabase()
	}

	changeDatabase(): void {
		if (this.selectedDatabase) {

			// 4. Guardar la nueva selección en el servicio
			this.dbProviderService.setProvider(this.selectedDatabase);

			console.log('Base de datos guardada:', this.selectedDatabase);

			// Simulación de proceso de cambio (Tu lógica)
			this.isConnected = false;
			setTimeout(() => {
				this.isConnected = true;
				// Puedes usar tu servicio de alertas aquí
				this.alertService.info(`Las futuras peticiones usarán ${this.getDatabaseName(this.selectedDatabase)}`);
			}, 1000);
		}
	}
}
