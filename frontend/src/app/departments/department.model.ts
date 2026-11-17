
export interface Department {
  id: number;
  code: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface DepartmentRequest {
  code: string;
  name: string;
  description: string;
}
