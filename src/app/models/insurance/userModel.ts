export interface UserMinimal {
  id: string;
  firstName: string;
  email: string;
  roles: string[];
  jobTitle: string;
  status: string;
}

export interface People {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
}

export interface UserDetail {
  id: string;
  people: People;
  phoneNumber: string;
  jobTitle: string;
  username: string;
  email: string;
  roles: string[];
  status: string;
  createdAt: Date;
  deleted: Date;
}
