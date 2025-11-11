export interface CustomerMinimal {
  id: string;
  email: string;
  customerStatus: string;
}

export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
  email: string;
  phoneNumber: string;
}

export interface CreateCustomerResponse {
  entityId: string;
}

export interface CustomerDetail {
  id: string;
  people: People;
  email: string;
  phoneNumber: string;
  assignedAgentId: string;
  customerStatus: string;
  status: string;
  createdAt: Date;
  isDeleted: boolean;
}

export interface People {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
}

export interface GetAllByAgentId {
  agentId: string;
  firstName: string;
  email: string;
  jobTitle: string;
  customers: CustomerMinimal[]
}

export interface assignedAgent {
  agentId: string;
}
