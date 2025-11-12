import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../models/medical.models';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private readonly API_URL = 'https://localhost:6911/api/doctor';

  constructor(private http: HttpClient) {}

  getDoctors(): Observable<any> {
    return this.http.get(`${this.API_URL}/GetAll/`);
  }

  getDoctor(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/GetById/${id}`);
  }

  createDoctor(doctor: Doctor): Observable<any> {
    return this.http.post(`${this.API_URL}/Create/`, doctor);
  }

  updateDoctor(doctor: Doctor): Observable<any> {
    return this.http.put(`${this.API_URL}/Update/`, doctor);
  }

  deleteDoctor(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/Delete/${id}`);
  }
}