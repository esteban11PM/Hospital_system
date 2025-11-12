import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class DatabaseProviderService {

	private readonly providerKey = 'db_provider';

	/**
	 * El proveedor por defecto que se usará si no hay nada en localStorage.
	 * Coincide con el default del backend.
	 */
	public readonly defaultProvider = 'sqlserver';

	constructor() { }

	/**
	 * Guarda la selección del proveedor de BD en el localStorage.
	 * @param provider El proveedor seleccionado (ej: 'sqlserver', 'mysql').
	 */
	setProvider(provider: string): void {
		localStorage.setItem(this.providerKey, provider);
	}

	/**
	 * Obtiene el proveedor de BD guardado del localStorage.
	 * Si no hay ninguno, devuelve el proveedor por defecto.
	 */
	getProvider(): string {
		return localStorage.getItem(this.providerKey) ?? this.defaultProvider;
	}
}
