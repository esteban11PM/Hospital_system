import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Specialty } from '../models/medical.models';

@Injectable({
  providedIn: 'root'
})
export class SpecialtyService {
  private readonly API_URL = 'https://localhost:6911/api/specialty';

  constructor(private http: HttpClient) {}

  getSpecialties(): Observable<any> {
    return this.http.get(`${this.API_URL}/GetAll/`);
  }

  getSpecialty(id: number): Observable<Specialty> {
    return this.http.get<Specialty>(`${this.API_URL}/specialties/${id}`);
  }

  createSpecialty(specialty: Omit<Specialty, 'id'>): Observable<Specialty> {
    return this.http.post<Specialty>(`${this.API_URL}/specialties`, specialty);
  }

  updateSpecialty(id: number, specialty: Partial<Specialty>): Observable<Specialty> {
    return this.http.put<Specialty>(`${this.API_URL}/specialties/${id}`, specialty);
  }

  deleteSpecialty(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/specialties/${id}`);
  }
}