import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/medical.models';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly API_URL = 'https://localhost:6911/api/appointment';

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<any> {
    return this.http.get(`${this.API_URL}/GetAll/`);
  }

  getAppointment(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.API_URL}/GetById/${id}`);
  }

  createAppointment(appointment: Omit<Appointment, 'id'>): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.API_URL}/Create/`, appointment);
  }

  updateAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.API_URL}/Update/`, appointment);
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/Delete/${id}`);
  }
}