
export interface Student {
  id: number;
  name: string;
  email: string;
  registerNumber: string;
  department: string;
  year: number;
  phoneNumber: string;
  createdAt: string;
}

export interface StudentCreate {
  name: string;
  email: string;
  registerNumber: string;
  department: string;
  year: number;
  phoneNumber: string;
}

export interface StudentUpdate {
  name: string;
  email: string;
  registerNumber: string;
  department: string;
  year: number;
  phoneNumber: string;
}
export type StudentPayload = StudentCreate;