export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiration: Date;
  user: User;
}

export interface RegisterRequest {
  username: string;
  password: string;
  patientId: number;
}

export interface User {
  id: number;
  username: string;
  patientId: number;
  roleId: number;
}