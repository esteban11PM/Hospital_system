import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AlertTotalService } from '../../../Core/Services/alert-total.service';
import { AuthService } from '../../../Core/Services/Auth/auth.service';
import { RoleRedirectService } from '../../../Core/Services/Auth/role-redirect.service';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink, MatIconModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css'
})
export class LoginComponent {

	// Inyección de servicios propios del proyecto
	private readonly authService = inject(AuthService);
	private readonly roleRedirect = inject(RoleRedirectService);
	private readonly alertService = inject(AlertTotalService);

	// Inyección de servicios nativos de Angular
	private readonly fb = inject(FormBuilder);

	// Signal para controlar el estado del inicio de sesión
	isLoggingIn = signal(false);

	// Variables de estado y control local
	hidePassword = true;

	// Formulario reactivo del componente - CORREGIDO
	loginForm = this.fb.group({
		username: ['', [Validators.required]],
		password: ['', [Validators.required]]
	});

	// Método auxiliar para mostrar errores correctamente
	shouldShowError(controlName: string): boolean {
		const control = this.loginForm.get(controlName);
		return !!(control?.invalid && control?.touched);
	}

	async onSubmit(): Promise<void> {
		// Marcar todos los campos como touched para mostrar errores
		this.loginForm.markAllAsTouched();

		if (this.loginForm.invalid || this.isLoggingIn()) {
			return;
		}

		const { username, password } = this.loginForm.value;

		this.isLoggingIn.set(true);

		try {
			const loginResponse = await this.alertService.withLoading(
				async () => {
					return await lastValueFrom(
						this.authService.login({ username: username!, password: password! })
					);
				},
				{
					loadingTitle: 'Iniciando sesión...',
					loadingText: 'Accediendo a Game Zone',
					showSuccessAlert: false,
					errorTitle: 'Error de autenticación',
					errorText: 'Credenciales incorrectas'
				}
			);

			this.authService.saveTokens(loginResponse);
			const role = this.authService.getRole();
			this.roleRedirect.redirectUser(role);

		} catch (error: any) {
			console.error('Login error:', error);
		} finally {
			this.isLoggingIn.set(false);
		}
	}
}
