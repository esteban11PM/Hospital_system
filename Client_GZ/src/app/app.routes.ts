import { Routes } from '@angular/router';
import { authGuard } from './Core/Guards/auth.guard';
import { roleGuard } from './Core/Guards/role.guard';
import { PageNotFoundComponent } from './Components/Shared/page-not-found/page-not-found.component';
import { LoginComponent } from './Views/Auth/login/login.component';
import { RegisterComponent } from './Views/Auth/register/register.component';

export const routes: Routes = [
	// -----------------------
	// Auth
	// -----------------------
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },

	// -----------------------
	// Layout (contenedor principal)
	// -----------------------
	{
		path: '',
		loadChildren: () => import('./Views/layout.routes').then(m => m.LAYOUT),
		canActivate: [authGuard, roleGuard],
		data: { roles: ['USUARIO', 'ADMINISTRADOR'] }
	},

	// -----------------------
	// Página no encontrada
	// -----------------------
	{ path: '**', component: PageNotFoundComponent },
];
