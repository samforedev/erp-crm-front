import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiSuccessResponse} from "../../models/apiResponse";
import {
  assignedAgent, changeCustomerStatus, changeCustomerStatusResponse,
  CreateCustomerRequest,
  CreateCustomerResponse,
  CustomerDetail,
  CustomerMinimal, GetAllByAgentId
} from "../../models/insurance/customerModel";
import {EntityCommonsResponse} from "../../models/commons/commonsModel";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly AUTH_API_URL = 'https://api.metacho.com/api/v1/customers';

  constructor(private httpClient: HttpClient) { }

  getAllCustomers(): Observable<ApiSuccessResponse<CustomerMinimal>> {
    return this.httpClient.get<ApiSuccessResponse<CustomerMinimal>>(this.AUTH_API_URL);
  }

  createCustomer(request: CreateCustomerRequest): Observable<ApiSuccessResponse<CreateCustomerResponse>> {
    return this.httpClient.post<ApiSuccessResponse<CreateCustomerResponse>>(this.AUTH_API_URL, request);
  }

  getCustomerById(id: string): Observable<ApiSuccessResponse<CustomerDetail>> {
    return this.httpClient.get<ApiSuccessResponse<CustomerDetail>>(`${this.AUTH_API_URL}/${id}`);
  }

  deleteCustomerById(id: string): Observable<ApiSuccessResponse<EntityCommonsResponse>> {
    return this.httpClient.delete<ApiSuccessResponse<EntityCommonsResponse>>(`${this.AUTH_API_URL}/${id}`);
  }

  updateCustomer(id: string, request: CreateCustomerRequest): Observable<ApiSuccessResponse<EntityCommonsResponse>> {
    return this.httpClient.put<ApiSuccessResponse<EntityCommonsResponse>>(`${this.AUTH_API_URL}/${id}`, request);
  }

  getAllByAgentId(agentId: string): Observable<ApiSuccessResponse<GetAllByAgentId>> {
    return this.httpClient.get<ApiSuccessResponse<GetAllByAgentId>>(`${this.AUTH_API_URL}/getByAgentId/${agentId}`);
  }

  assignAgent(customerId: string, request: assignedAgent): Observable<ApiSuccessResponse<CustomerDetail>> {
    return this.httpClient.post<ApiSuccessResponse<CustomerDetail>>(`${this.AUTH_API_URL}/${customerId}/assignAgent`, request);
  }

  updateCustomerStatus(request: changeCustomerStatus): Observable<ApiSuccessResponse<changeCustomerStatusResponse>> {
    return this.httpClient.post<ApiSuccessResponse<changeCustomerStatusResponse>>(`${this.AUTH_API_URL}/changeCustomerStatus`, request);
  }

}
