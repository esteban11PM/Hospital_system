import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { SMLandingComponent } from '../Components/Shared/SM-Landing/landing.component';

export const LAYOUT: Routes = [
	{
		path: '',
		component: LayoutComponent,
		children: [
			{ path: 'landing', component: SMLandingComponent },

			{
				path: 'securitymodel',
				loadChildren: () => import('./SecurityModel/sm.routes').then(m => m.SM_ROUTES)
			},

			{
				path: 'system',
				loadChildren: () => import('./System/system.routes').then(m => m.SYSTEM)
			},

			// Redirección por defecto
			{ path: '', redirectTo: 'landing', pathMatch: 'full' },
		]
	}
];
