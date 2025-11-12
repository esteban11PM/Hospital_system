import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from '../user.service';
import { UserMod, UserOptionsMod } from '../../../Models/SecurityModel/UserMod.model';
import { environment } from '../../../../../environments/environment';



// 'describe' define un "Test Suite" (un grupo de pruebas)
describe('UserService', () => {

	let service: UserService;
	let httpMock: HttpTestingController; // El simulador de HttpClient
	let apiUrl: string;

	// 'beforeEach' se ejecuta ANTES de cada prueba ('it')
	beforeEach(() => {

		// 1. Configurar el Módulo de Pruebas (TestBed)
		// Esto es similar a tu CustomWebApplicationFactory en .NET
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule // Importamos el módulo que simula HttpClient
			],
			providers: [
				UserService // Proveemos el servicio real que queremos probar
			]
		});

		// 2. Inyectar las dependencias
		// Obtenemos la instancia real del servicio y el mock de HTTP
		service = TestBed.inject(UserService);
		httpMock = TestBed.inject(HttpTestingController);

		// Definimos la URL base que esperamos
		apiUrl = environment.apiURL + 'api/User/';
	});

	// 'afterEach' se ejecuta DESPUÉS de cada prueba
	afterEach(() => {
		// Verificamos que no haya peticiones HTTP pendientes
		httpMock.verify();
	});

	// 'it' define una prueba individual (un "Test Case")
	it('should be created', () => {
		// Afirmamos que el servicio se inyectó correctamente
		expect(service).toBeTruthy();
	});

	// --- PRUEBA PARA GetAll ---
	it('should retrieve all users via GET from the correct URL', () => {

		// 1. Arrange (Organizar) - Datos falsos que simulará la API
		const mockUsers: UserMod[] = [
			{ id: 1, username: 'user1', password: '***', active: true, personId: 1 , personName: 'Test', roleId: 1,  roleName: 'Admin' },
			{ id: 2, username: 'user2', password: '***', active: true, personId: 2 , personName: 'Test 2', roleId: 1,  roleName: 'User' }
		];

		// 2. Act (Actuar) - Llamamos al método del servicio
		service.getAll().subscribe(users => {
			// 4. Assert (Resultado) - Verificamos que los datos recibidos son los mocks
			expect(users.length).toBe(2);
			expect(users).toEqual(mockUsers);
		});

		// 3. Assert (Comportamiento) - Verificamos la petición HTTP
		// Esperamos que se haya hecho UNA petición a esta URL
		const req = httpMock.expectOne(`${apiUrl}GetAll/`);

		// Verificamos que el método sea GET
		expect(req.request.method).toBe('GET');

		// 'flush' simula la respuesta del servidor. Envía los 'mockUsers'
		req.flush(mockUsers);
	});

	// --- PRUEBA PARA Create ---
	it('should send a user via POST to the correct URL', () => {

		// 1. Arrange
		const newUser: UserOptionsMod = { id: 0, username: 'newUser', password: '123', active: true, personId: 5, roleId: 1,  };
		const expectedResponse: UserMod = { id: 5, username: 'newUser', password: '***', active: true, personName: 'New', personId: 5, roleName: 'User', roleId: 1};

		// 2. Act
		service.create(newUser).subscribe(response => {
			// 4. Assert (Resultado)
			expect(response).toEqual(expectedResponse);
			expect(response.id).toBe(5);
		});

		// 3. Assert (Comportamiento)
		const req = httpMock.expectOne(`${apiUrl}Create/`);
		expect(req.request.method).toBe('POST');

		// Verificamos que el 'body' de la petición POST sea el 'newUser'
		expect(req.request.body).toEqual(newUser);

		// Simulamos la respuesta
		req.flush(expectedResponse);
	});

	// --- PRUEBA PARA Delete ---
	it('should send a DELETE request with logical strategy (0)', () => {
		const userId = 10;
		const strategy = 0; // Lógica

		// 2. Act
		service.delete(userId, strategy).subscribe();

		// 3. Assert
		const req = httpMock.expectOne(`${apiUrl}Delete/${userId}/?strategy=${strategy}`);
		expect(req.request.method).toBe('DELETE');
		req.flush(null); // Simulamos una respuesta vacía
	});
});
