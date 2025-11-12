import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConsultingRoom } from '../models/medical.models';

@Injectable({
  providedIn: 'root'
})
export class ConsultingRoomService {
  private readonly API_URL = 'https://localhost:6911/api/consultingroom';

  constructor(private http: HttpClient) {}

  getConsultingRooms(): Observable<any> {
    return this.http.get(`${this.API_URL}/GetAll/`);
  }

  getConsultingRoom(id: number): Observable<ConsultingRoom> {
    return this.http.get<ConsultingRoom>(`${this.API_URL}/consulting-rooms/${id}`);
  }

  createConsultingRoom(consultingRoom: Omit<ConsultingRoom, 'id'>): Observable<ConsultingRoom> {
    return this.http.post<ConsultingRoom>(`${this.API_URL}/consulting-rooms`, consultingRoom);
  }

  updateConsultingRoom(id: number, consultingRoom: Partial<ConsultingRoom>): Observable<ConsultingRoom> {
    return this.http.put<ConsultingRoom>(`${this.API_URL}/consulting-rooms/${id}`, consultingRoom);
  }

  deleteConsultingRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/consulting-rooms/${id}`);
  }
}