import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './Core/Interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
	providers: [
		provideAnimations(),
		provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
	]
};
