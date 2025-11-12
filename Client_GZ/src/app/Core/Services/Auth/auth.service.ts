// ===== SERVICIO DE AUTENTICACIÓN =====
// Gestiona el flujo de autenticación del usuario: login, registro, recuperación de contraseñas,
// validación de tokens JWT y extracción de información del payload. Además, maneja la
// persistencia del token en localStorage y provee utilidades para validar roles y sesiones.

import { HttpClient, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, catchError, filter, firstValueFrom, map, Observable, switchMap, take, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RoleMod } from '../../Models/SecurityModel/RoleMod.model';
import { AlertTotalService } from '../alert-total.service';

// Payload del token
export interface JwtPayload {
	nameid: string;
	personId: string;
	unique_name: string;
	role: string;
	exp: number;
}

// Interfaz para la respuesta del Login y Refresh
export interface AuthResponse {
	token: string;
	refreshToken: string;
}

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	private readonly alertService = inject(AlertTotalService)

	// Claves para localStorage
	private readonly tokenKey = 'auth_token';
	private readonly refreshTokenKey = 'auth_refresh_token';
	private readonly baseUrl = `${environment.apiURL}api/Auth/`;

	// --- Para manejo de Refresh Token Concurrente ---
	private refreshTokenSubject = new BehaviorSubject<string | null>(null);
	private isRefreshing = false;

	// --- Para la Alerta Proactiva ---
	private sessionTimer: any; // Handle para el setTimeout

	constructor(
		private http: HttpClient,
		private router: Router,
	) { }

	// ==================================================
	// MÉTODOS DE AUTH (Sin cambios)
	// ==================================================

	login(credentials: { username: string; password: string }): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(`${this.baseUrl}Login`, credentials).pipe(
			tap(response => {
				this.saveTokens(response);
				this.scheduleProactiveRefresh(); // <-- Esto ahora funcionará bien
			})
		);
	}

	logout(): void {
		localStorage.removeItem(this.tokenKey);
		localStorage.removeItem(this.refreshTokenKey);
		if (this.sessionTimer) {
			clearTimeout(this.sessionTimer);
		}
		this.router.navigate(['/login']);
	}

	register(userData: any): Observable<any> {
		return this.http.post<any>(`${this.baseUrl}Register`, userData);
	}

	// ==================================================
	// MÉTODOS DE MANEJO DE TOKENS (Sin cambios)
	// ==================================================

	public saveTokens(data: AuthResponse): void {
		localStorage.setItem(this.tokenKey, data.token);
		localStorage.setItem(this.refreshTokenKey, data.refreshToken);
	}

	getToken(): string | null {
		return localStorage.getItem(this.tokenKey);
	}

	getRefreshToken(): string | null {
		return localStorage.getItem(this.refreshTokenKey);
	}

	isAuthenticated(): boolean {
		const token = this.getToken();
		if (!token) return false;
		const payload = this.getTokenPayload();
		if (!payload) return false;
		return payload.exp * 1000 > Date.now();
	}

	// ==================================================
	// MÉTODOS DEL INTERCEPTOR (Refresh Pasivo - Sin cambios)
	// ==================================================

	handle401Error(request: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
		if (!this.isRefreshing) {
			this.isRefreshing = true;
			this.refreshTokenSubject.next(null);

			return this.callRefreshToken().pipe(
				switchMap((newAccessToken: string) => {
					this.isRefreshing = false;
					this.refreshTokenSubject.next(newAccessToken);
					return next(this.addTokenHeader(request, newAccessToken));
				}),
				catchError((err) => {
					this.isRefreshing = false;
					this.logout();
					return throwError(() => err);
				})
			);
		} else {
			return this.refreshTokenSubject.pipe(
				filter(token => token != null),
				take(1),
				switchMap((jwt) => {
					return next(this.addTokenHeader(request, jwt));
				})
			);
		}
	}

	private callRefreshToken(): Observable<string> {
		const refreshToken = this.getRefreshToken();
		if (!refreshToken) {
			this.logout();
			return throwError(() => new Error('No refresh token available'));
		}

		const payload = { refreshToken: refreshToken };

		return this.http.post<AuthResponse>(`${this.baseUrl}Refresh`, payload).pipe(
			tap((tokens: AuthResponse) => {
				this.saveTokens(tokens);
				this.scheduleProactiveRefresh(); // <-- Esto reiniciará el timer correctamente
			}),
			map(tokens => tokens.token),
			catchError((err) => {
				this.logout();
				return throwError(() => err);
			})
		);
	}

	private addTokenHeader(request: HttpRequest<any>, token: string) {
		return request.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`
			}
		});
	}

	// ==================================================
	// ALERTA PROACTIVA (Sección MODIFICADA)
	// ==================================================

	public scheduleProactiveRefresh(): void {
		if (this.sessionTimer) {
			clearTimeout(this.sessionTimer);
		}

		// --- CAMBIO 1: Leer el payload del REFRESH token ---
		const payload = this.getRefreshTokenPayload();

		// --- CAMBIO 2: Añadir validación por si el token no existe ---
		if (!payload) {
			console.error("No se pudo programar el refresco: Refresh token no encontrado o inválido.");
			return;
		}

		const exp = payload.exp;
		if (exp === 0) return;

		const timeRemainingMs = (exp * 1000) - Date.now();
		const timeToAlertMs = timeRemainingMs - (60 * 1000); // 1 minuto antes

		// (Log de depuración útil)
		console.log(`Próxima alerta de refresco programada en ${(timeToAlertMs / 1000 / 60).toFixed(2)} minutos.`);

		if (timeToAlertMs > 0) {
			this.sessionTimer = setTimeout(() => {
				this.showRefreshAlert();
			}, timeToAlertMs);
		}
	}

	/**
	 * Muestra la alerta de confirmación (Sin cambios)
	 */
	private async showRefreshAlert(): Promise<void> {

		const result = await this.alertService.confirm(
			'Tu sesión está a punto de expirar',
			'¿Deseas renovarla para continuar trabajando?',
			'Sí, renovar', // confirmText
			'No, salir'    // cancelText
		);

		if (result.isConfirmed) {
			// El usuario dijo SÍ: refresca activamente
			try {
				await firstValueFrom(this.callRefreshToken());
				this.alertService.toast('Sesión renovada', 'success');
				console.log('Sesión renovada exitosamente.');

			} catch (error) {
				await this.alertService.error(
					'No se pudo renovar la sesión',
					'Serás desconectado.'
				);
				this.logout();
			}

		} else {
			// El usuario dijo NO: programar alerta de expiración y deslogueo.
			const accessTokenPayload = this.getTokenPayload();
			const timeToExpire = (accessTokenPayload.exp * 1000) - Date.now();

			setTimeout(async () => {
				await this.alertService.info(
					'Tu sesión ha expirado',
					'Has sido desconectado.'
				);
				this.logout();
			}, timeToExpire > 0 ? timeToExpire : 0);
		}
	}

	// ==================================================
	// MÉTODOS DE PAYLOAD (Sección MODIFICADA)
	// ==================================================

	// (Esta función no cambió)
	getTokenPayload(): JwtPayload {
		const token = this.getToken();
		return token ? jwtDecode<JwtPayload>(token) : { nameid: '', personId: '', unique_name: '', role: '', exp: 0 };
	}

	// --- CAMBIO 3: Nueva función añadida ---
	/**
	 * Decodifica el Refresh Token para leer su expiración.
	 */
	getRefreshTokenPayload(): JwtPayload | null {
		const token = this.getRefreshToken(); // <-- Lee el refresh token
		if (!token) {
			return null;
		}
		try {
			return jwtDecode<JwtPayload>(token);
		} catch (error) {
			console.error("Error decodificando el refresh token:", error);
			return null;
		}
	}

	// (Estas funciones no cambiaron)
	getAllRoles(): Observable<RoleMod[]> {
		return this.http.get<RoleMod[]>(`${this.baseUrl}GetAllRoles/`);
	}

	getIdUser(): string {
		return this.getTokenPayload().nameid;
	}
	getIdPerson(): string {
		return this.getTokenPayload().personId;
	}
	getRole(): string {
		return this.getTokenPayload().role;
	}
	getUsername(): string {
		return this.getTokenPayload().unique_name;
	}
}
