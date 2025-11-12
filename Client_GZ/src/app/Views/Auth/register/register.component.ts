import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { NumericInputDirective } from '../../../Core/Directives/numeric-input.directive';
import { colombianPhoneValidator, emailValidator, strongPassword } from '../../../Core/Utils/input-validators.utils';
import { AlertTotalService } from '../../../Core/Services/alert-total.service';
import { AuthService } from '../../../Core/Services/Auth/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatSelectModule,
		MatIconModule,
		MatToolbarModule,
		MatTooltipModule,
		RouterLink,
		NumericInputDirective
	],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

	// Inyección de servicios propios del proyecto
	private readonly authService = inject(AuthService);
	private readonly alertService = inject(AlertTotalService);

	// Inyección de servicios nativos de Angular
	private readonly fb = inject(FormBuilder);
	private readonly router = inject(Router);

	// Signal para controlar el estado del envío de formularios
	isSubmitting = signal(false);

	// Variables de estado y control local
	hidePassword = true;
	wasSubmitted = false;
	roles: any[] = [];

	ngOnInit(): void {
		this.authService.getAllRoles().subscribe({
			next: (roles) => this.roles = roles,
			error: (err) => {
				console.log('Error al cargar los datos:', err);
				const mensajeCompleto = err?.error?.message || 'Ocurrió un error inesperado.';
				const mensaje = mensajeCompleto.split(':')[1]?.trim() || mensajeCompleto;
				this.alertService.error;
			}
		});
	}

	// Formulario reactivo del componente
	registerForm = this.fb.nonNullable.group({
		username: ['', [Validators.required, Validators.minLength(3)]],
		password: ['', [Validators.required, Validators.minLength(8), strongPassword()]],
		name: ['', [Validators.required, Validators.minLength(3)]],
		lastName: ['', [Validators.required, Validators.minLength(3)]],
		email: ['', [Validators.required, emailValidator()]],
		phone: ['', [
			Validators.required,
			colombianPhoneValidator()
		]],
		roleId: [0,]
	});

	async onSubmit(): Promise<void> {
		this.wasSubmitted = true;

		if (this.registerForm.invalid || this.isSubmitting()) {
			this.registerForm.markAllAsTouched();

			const errors = this.getFormErrors();
			if (errors.length > 0) {
				this.alertService.warning(
					'Formulario incompleto',
					`Por favor corrige los siguientes errores:\n• ${errors.join('\n• ')}`
				);
			}
			return;
		}

		this.isSubmitting.set(true);

		const {
			username,
			password,
			name,
			lastName,
			email,
			phone,
			roleId
		} = this.registerForm.getRawValue();

		try {
			await this.alertService.withLoading(
				() => lastValueFrom(this.authService.register({
					username: username!,
					password: password!,
					name: name!,
					lastName: lastName!,
					email: email!.trim().toLowerCase(),
					phone: phone!,
					roleId: roleId!,
				})),
				{
					loadingTitle: 'Creando cuenta...',
					loadingText: 'Procesando tu registro',
					successTitle: 'Registro Exitoso',
					successText: 'Tu cuenta ha sido creada',
					errorTitle: 'Error en el registro',
					errorText: 'Ocurrió un error al crear tu cuenta'
				}
			);

			// El servicio ya mostró la alerta de éxito, ahora navegamos
			this.router.navigate(['/login']);

		} catch (error: any) {
			console.error('Error al registrar:', error);

			if (error?.error?.error) {
				console.log('Detalles del error de la API:', error.error.error);
			}

		} finally {
			this.isSubmitting.set(false);
		}
	}

	private getFormErrors(): string[] {
		const errors: string[] = [];

		Object.keys(this.registerForm.controls).forEach(key => {
			const control = this.registerForm.get(key);
			if (control?.errors && control.touched) {
				const fieldName = this.getFieldDisplayName(key);

				if (control.errors['required']) {
					errors.push(`${fieldName} es requerido`);
				}
				if (control.errors['minlength']) {
					const requiredLength = control.errors['minlength'].requiredLength;
					errors.push(`${fieldName} debe tener al menos ${requiredLength} caracteres`);
				}
				if (control.errors['strongPassword']) {
					errors.push(`${fieldName} debe ser más segura`);
				}
				if (control.errors['email']) {
					errors.push(`${fieldName} debe ser un correo válido`);
				}
				if (control.errors['colombianPhone']) {
					errors.push(`${fieldName} debe ser un teléfono colombiano válido`);
				}
			}
		});

		return errors;
	}

	private getFieldDisplayName(fieldName: string): string {
		const displayNames: { [key: string]: string } = {
			username: 'Nombre de usuario',
			password: 'Contraseña',
			name: 'Nombre',
			lastName: 'Apellido',
			email: 'Correo electrónico',
			phone: 'Teléfono',
			roleId: 'Rol'
		};

		return displayNames[fieldName] || fieldName;
	}

	// Método para mostrar errores correctamente
	shouldShowError(controlName: string): boolean {
		const control = this.registerForm.get(controlName);
		return !!(control?.invalid && (control?.touched || this.wasSubmitted));
	}

	// Método para obtener mensajes de error específicos
	getErrorMessage(controlName: string): string {
		const control = this.registerForm.get(controlName);

		if (!control?.errors) return '';

		if (control.hasError('required')) {
			return 'Campo requerido';
		}

		if (control.hasError('minlength')) {
			const requiredLength = control.errors['minlength'].requiredLength;
			return `Mínimo ${requiredLength} caracteres`;
		}

		if (control.hasError('strongPassword')) {
			return 'Incluye mayúsculas, minúsculas, números y símbolos';
		}

		if (control.hasError('email')) {
			return 'Email inválido';
		}

		if (control.hasError('colombianPhone')) {
			return 'Teléfono colombiano inválido';
		}

		if (control.hasError('pattern')) {
			return 'Solo números, 10 dígitos';
		}

		return 'Campo inválido';
	}
}
