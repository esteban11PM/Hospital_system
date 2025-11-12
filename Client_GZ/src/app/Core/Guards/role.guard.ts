// ==================================================
// Guard: roleGuard
// ==================================================
// Este guard protege rutas según el rol del usuario.
// Permite el acceso solo si el rol actual coincide con alguno de los roles esperados definidos en la ruta.

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/Auth/auth.service';

export const roleGuard: CanActivateFn = (route) => {

	// Inyección de servicios propios del proyecto
	const authService = inject(AuthService);

	// Inyección de servicios nativos de Angular
	const router = inject(Router);

	// Obtención de roles esperados desde la configuración de la ruta
	const userRole = authService.getRole();

	// Si no hay rol de usuario, redirige al inicio
	if (!userRole) {
		router.navigate(['/login']);
		return false;
	}

	return true;
};
