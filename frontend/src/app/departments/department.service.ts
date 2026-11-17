
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Department, DepartmentRequest } from './department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private http = inject(HttpClient);

  // Replace with your actual backend URL
  private apiUrl = 'https://localhost:7258/api/departments';

  getAll() {
    return this.http.get<Department[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<Department>(`${this.apiUrl}/${id}`);
  }

  search(keyword: string) {
    return this.http.get<Department[]>(
      `${this.apiUrl}/search`,
      { params: { keyword } }
    );
  }

  add(department: DepartmentRequest) {
    return this.http.post<Department>(this.apiUrl, department);
  }

  update(id: number, department: DepartmentRequest) {
    return this.http.put(`${this.apiUrl}/${id}`, department);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
