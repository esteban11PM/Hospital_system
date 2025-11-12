// ===== SERVICIOS DE ENTIDADES =====
// Conjunto de servicios que heredan de GenericService<TWrite, TRead> para estandarizar
// las operaciones CRUD (GetAll, GetById, Create, Update, Delete).
// Cada servicio se especializa en una entidad del sistema, centralizando
// la comunicación con su respectiva API.

import { Injectable } from '@angular/core';
import { GenericService } from '../generic.service';
import { GameMod } from '../../Models/System/GameMod.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

// Comparten el método extra getAllJWT() para obtener datos filtrados por autenticación JWT
@Injectable({
  providedIn: 'root'
})
export class GameService extends GenericService<GameMod, GameMod> {

  constructor(http: HttpClient) {
    const baseURL = environment.apiURL + 'api/Game/';
    super(http, baseURL);
  }

    getAllJWT(): Observable<GameMod[]>{
    return this.http.get<GameMod[]>(`${this.baseUrl}GetAllJWT/`);
  }
}
