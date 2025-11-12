import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/medical.models';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private readonly API_URL = 'https://localhost:6911/api/patient';

  constructor(private http: HttpClient) {}

  getPatients(): Observable<any> {
    return this.http.get(`${this.API_URL}/GetAll/`);
  }

  getPatient(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/GetById/${id}`);
  }

  createPatient(patient: Patient): Observable<any> {
    return this.http.post(`${this.API_URL}/Create/`, patient);
  }

  updatePatient(patient: Patient): Observable<any> {
    return this.http.put(`${this.API_URL}/Update/`, patient);
  }

  deletePatient(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/Delete/${id}`);
  }
}