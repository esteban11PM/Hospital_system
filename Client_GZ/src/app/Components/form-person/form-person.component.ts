import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { NumericInputDirective } from '../../Core/Directives/numeric-input.directive';
import { AuthService } from '../../Core/Services/Auth/auth.service';
import { PersonMod } from '../../Core/Models/SecurityModel/PersonMod.model';
import { colombianPhoneValidator, emailValidator } from '../../Core/Utils/input-validators.utils';

@Component({
	selector: 'app-form-person',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatSlideToggleModule,
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
		NumericInputDirective
	],
	templateUrl: './form-person.component.html',
	styleUrls: ['./form-person.component.css']
})
export class FormPersonComponent implements OnInit, OnChanges {

	// Inyección de servicios propios del proyecto
	private readonly authService = inject(AuthService);

	// Inyección de servicios nativos de Angular
	private readonly fb = inject(FormBuilder);
	private readonly router = inject(Router);

	// Inputs principales del componente
	@Input() person: PersonMod | null = null;
	@Input() cancelRoute: string = '/Person';

	// Outputs de eventos emitidos al componente padre
	@Output() save = new EventEmitter<PersonMod>();

	// Variables de estado y control local
	isEditMode = false;
	showReactivarToggle = false;
	reactivarRegistro = false;

	// Formulario reactivo del componente
	formPerson!: FormGroup;

	// Métodos del ciclo de vida del componente
	ngOnInit(): void {
		this.buildForm();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['person'] && this.person) {
			this.isEditMode = !!this.person.id;
			this.patchFormValues(this.person);
		}

		if (this.isEditMode && this.person) {
			const isInactive = this.person.active === false;
			const isAdmin = this.authService.getRole() === 'ADMINISTRADOR';
			this.showReactivarToggle = isInactive && isAdmin;
		}
	}

	onToggleChange(event: MatSlideToggleChange): void {
		this.reactivarRegistro = event.checked;
		this.formPerson.patchValue({
			active: event.checked
		});
	}

	private buildForm(): void {
		this.formPerson = this.fb.group({
			name: ['', [Validators.required, Validators.minLength(3)]],
			lastName: ['', [Validators.required, Validators.minLength(3)]],
			email: ['', [Validators.required, emailValidator()]],
			phone: ['', [Validators.required, colombianPhoneValidator()]],
			active: [true]
		});
	}

	private patchFormValues(person: PersonMod): void {
		this.formPerson.patchValue({
			...person,
		});
	}

	onSubmit(): void {
		if (this.formPerson.invalid) {
			this.formPerson.markAllAsTouched();
			return;
		}

		const result: PersonMod = {
			...this.person,
			...this.formPerson.value,
			email: this.formPerson.value.email.trim().toLowerCase()
		};

		this.save.emit(result);
	}

	onCancel(): void {
		this.router.navigate([this.cancelRoute]);
	}
}
