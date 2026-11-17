
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DepartmentService } from '../department.service';
import { Department } from '../department.model';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './department-list.html',
  styleUrl: './department-list.css'
})
export class DepartmentList {
  private service = inject(DepartmentService);
  private router = inject(Router);

  departments = signal<Department[]>([]);
  loading = signal(false);
  error = signal('');
  keyword = signal('');

  get isAdmin(): boolean {
    return sessionStorage.getItem('role') === 'Admin';
  }

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.loading.set(true);
    this.error.set('');

    this.service.getAll().subscribe({
      next: (data) => {
        this.departments.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load departments');
        this.loading.set(false);
      }
    });
  }

  search(value: string) {
    this.keyword.set(value);

    if (!value.trim()) {
      this.loadDepartments();
      return;
    }

    this.loading.set(true);
    this.service.search(value).subscribe({
      next: (data) => {
        this.departments.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Search failed');
        this.loading.set(false);
      }
    });
  }

  addDepartment() {
    this.router.navigate(['/departments/add']);
  }

  editDepartment(id: number) {
    this.router.navigate(['/departments/edit', id]);
  }

  deleteDepartment(id: number) {
    if (!this.isAdmin) return;

    if (!confirm('Are you sure you want to delete this department?'))
      return;

    this.service.delete(id).subscribe({
      next: () => this.loadDepartments(),
      error: () => this.error.set('Unable to delete department')
    });
  }

  goBack() {
    this.router.navigate([
      this.isAdmin ? '/admin' : '/staff'
    ]);
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
