// ==================================================
// Interceptor: authInterceptor
// ==================================================
// Este interceptor agrega el token de autenticación a todas las solicitudes HTTP salientes.
// Si el usuario tiene un token válido, se incluye en el encabezado `Authorization` para
// permitir el acceso a rutas protegidas en el backend.

import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../Services/Auth/auth.service';
import { catchError, throwError } from 'rxjs';
import { DatabaseProviderService } from '../Services/database-provider.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {

	const authService = inject(AuthService);
	const dbProviderService = inject(DatabaseProviderService);

	const token = authService.getToken();
	const provider = dbProviderService.getProvider();

	// --- Lógica de Headers Actualizada ---

	// 1. Crear un objeto para los headers
	const headers: any = {};

	// 2. Añadir el proveedor de BD.
	headers['X-Db-Provider'] = provider;

	// 3. Añadir el token de autorización SÓLO si existe
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	// 4. Clonar la petición UNA SOLA VEZ con todos los headers
	req = req.clone({
		setHeaders: headers
	});

	// 5. Envía la petición y maneja errores
	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			if (error.status === 401) {
				if (req.url.includes('/login') ||
					req.url.includes('/register') ||
					req.url.includes('/Refresh')) {
					return throwError(() => error);
				}
				return authService.handle401Error(req, next);
			}
			return throwError(() => error);
		})
	);
};
