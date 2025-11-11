import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiSuccessResponse} from "../../models/apiResponse";
import {UserMinimal} from "../../models/insurance/userModel";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly BASE_URL = 'http://localhost:8081/api/v1/users';

  constructor(private httpClient: HttpClient) { }

  getAllUsers(request: any): Observable<ApiSuccessResponse<UserMinimal[]>> {
    return this.httpClient.post<ApiSuccessResponse<UserMinimal[]>>(this.BASE_URL, request);
  }

}
