// ==================================================
// Funciones de autenticación y control de sesión
// ==================================================
// Conjunto de utilidades relacionadas con la gestión de roles y autenticación

import { lastValueFrom, Observable } from "rxjs";


// Verifica si el rol proporcionado corresponde a un administrador
export function isAdminRole(role: string | null | undefined): boolean {
	return (role || '') === 'ADMINISTRADOR';
}

// Convierte Observables de Angular en Promesas nativas para uso en contextos async/await.
// Simplifica la integración entre código reactivo (Observables) y código imperativo (async/await).
export function toPromise<T>(observable: Observable<T>): Promise<T> {
	return lastValueFrom(observable);
}
