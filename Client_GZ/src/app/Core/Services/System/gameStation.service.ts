// ===== SERVICIOS DE ENTIDADES =====
// Conjunto de servicios que heredan de GenericService<TWrite, TRead> para estandarizar
// las operaciones CRUD (GetAll, GetById, Create, Update, Delete).
// Cada servicio se especializa en una entidad del sistema, centralizando
// la comunicación con su respectiva API.

import { Injectable } from '@angular/core';
import { GenericService } from '../generic.service';
import { GameStationMod } from '../../Models/System/GameStationMod.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

// Comparten el método extra getAllJWT() para obtener datos filtrados por autenticación JWT
@Injectable({
  providedIn: 'root'
})
export class GameStationService extends GenericService<GameStationMod, GameStationMod> {

  constructor(http: HttpClient) {
    const baseURL = environment.apiURL + 'api/GameStation/';
    super(http, baseURL);
  }

    getAllJWT(): Observable<GameStationMod[]>{
    return this.http.get<GameStationMod[]>(`${this.baseUrl}GetAllJWT/`);
  }
}
