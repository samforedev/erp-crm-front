import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginRequest, LoginResponse, RegisterRequest} from "../../models/auth/authModels";
import {Observable} from "rxjs";
import {ApiSuccessResponse} from "../../models/apiResponse";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly AUTH_API_URL = 'http://localhost:8080/api/v1/auth';
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private httpClient: HttpClient) { }

  login(credentials: LoginRequest): Observable<ApiSuccessResponse<LoginResponse>> {
    const url = `${this.AUTH_API_URL}/login`;
    return this.httpClient.post<ApiSuccessResponse<LoginResponse>>(url, credentials);
  }

  register(request: RegisterRequest): Observable<ApiSuccessResponse<string>> {
    const url = `${this.AUTH_API_URL}/register`;
    return this.httpClient.post<ApiSuccessResponse<string>>(url, request);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    // Podrías añadir lógica de limpieza de estado aquí
  }

}
