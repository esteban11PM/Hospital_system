// ==================================================
// Directiva: LogoutButtonDirective
// ==================================================
// Esta directiva agrega comportamiento de cierre de sesión al elemento sobre el cual se aplica.
// Al hacer clic, muestra una alerta de confirmación y ejecuta el cierre de sesión si el usuario lo confirma.

import { Directive, HostListener, inject } from '@angular/core';
import { AlertTotalService } from '../Services/alert-total.service';
import { AuthService } from '../Services/Auth/auth.service';


@Directive({
	selector: '[appLogoutButton]',
	standalone: true
})
export class LogoutButtonDirective {

	private readonly alertService = inject(AlertTotalService);
	private readonly authService = inject(AuthService);

	@HostListener('click')
	onClick(): void {
		this.alertService.confirmLogout().then((result) => {
			if (result.isConfirmed) {
				this.authService.logout();
				this.alertService.toast("Sesión cerrada correctamente", 'success');
			}
		});
	}
}
