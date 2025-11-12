import { Routes } from '@angular/router';
import { IndicePersonComponent } from './Person/indice-person/indice-person.component';
import { CreatePersonComponent } from './Person/create-person/create-person.component';
import { UpdatePersonComponent } from './Person/update-person/update-person.component';
import { IndiceRoleComponent } from './Role/indice-role/indice-role.component';
import { CreateRoleComponent } from './Role/create-role/create-role.component';
import { UpdateRoleComponent } from './Role/update-role/update-role.component';
import { IndiceUserComponent } from './User/indice-user/indice-user.component';
import { CreateUserComponent } from './User/create-user/create-user.component';
import { UpdateUserComponent } from './User/update-user/update-user.component';

export const SM_ROUTES: Routes = [
	{ path: '', redirectTo: 'person', pathMatch: 'full' },

	{ path: 'person', component: IndicePersonComponent },
	{ path: 'person/create', component: CreatePersonComponent },
	{ path: 'person/update/:id', component: UpdatePersonComponent },

	{ path: 'user', component: IndiceUserComponent },
	{ path: 'user/create', component: CreateUserComponent },
	{ path: 'user/update/:id', component: UpdateUserComponent },

	{ path: 'role', component: IndiceRoleComponent },
	{ path: 'role/create', component: CreateRoleComponent },
	{ path: 'role/update/:id', component: UpdateRoleComponent },
];
