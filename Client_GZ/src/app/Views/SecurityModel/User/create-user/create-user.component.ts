import { Component, inject, OnInit } from '@angular/core';
import { PersonService } from '../../../../Core/Services/SecurityModel/person.service';
import { UserService } from '../../../../Core/Services/SecurityModel/user.service';
import { PersonAvailableMod } from '../../../../Core/Models/SecurityModel/PersonMod.model';
import Swal from 'sweetalert2';
import { UserOptionsMod } from '../../../../Core/Models/SecurityModel/UserMod.model';
import { Router } from '@angular/router';
import { FormUserComponent } from '../../../../Components/form-user/form-user.component';
import { RoleService } from '../../../../Core/Services/SecurityModel/role.service';
import { RoleMod } from '../../../../Core/Models/SecurityModel/RoleMod.model';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [FormUserComponent],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit {

	// Inyección de servicios propios del proyecto
  private readonly userService = inject(UserService);
  private readonly personService = inject(PersonService);
  private readonly roleService = inject(RoleService);

	// Inyección de servicios nativos de Angular
  private readonly router = inject(Router);

  personsAvailable: PersonAvailableMod[] = [];
  rolesAvailable: RoleMod[] = [];

  ngOnInit(): void {
    this.personService.getAvailable().subscribe({
      next: (data) => this.personsAvailable = data,
      error: (err) => {
        console.log("Error al obtener PersonAvailable:", err);
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

		this.roleService.getAll().subscribe({
      next: (data) => this.rolesAvailable = data,
      error: (err) => {
        console.log("Error al obtener Role Getll:", err);
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

  handleSaveUser(newUser: UserOptionsMod): void {
    // console.log(newUser);
    this.userService.create(newUser).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: `Creacion de ${newUser.username}✅`,
          confirmButtonText: 'Aceptar'
        })
        this.router.navigate(['/securitymodel/user']);
      },
      error: (err) =>{
        console.log('Error al Crear User:', err);
        const mensajeCompleto = err?.error?.message || 'Ocurrio un error inesperado.';
        const mensaje = mensajeCompleto.split(':')[1]?.trim() || mensajeCompleto;
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: mensaje,
          confirmButtonText: 'Aceptar'
        })
      }
    });
  }
}
