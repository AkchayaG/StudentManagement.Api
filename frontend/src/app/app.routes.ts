
import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { StaffDashboard } from './pages/staff-dashboard/staff-dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: Login
  },
  {
    path: 'admin',
    component: AdminDashboard,
    canActivate: [authGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'staff',
    component: StaffDashboard,
    canActivate: [authGuard],
    data: { role: 'Staff' }
  },

  // FEATURE 2 - STUDENT MANAGEMENT
  {
    path: 'students',
    loadComponent: () =>
      import('./pages/student-list/student-list')
        .then(m => m.StudentList),
    canActivate: [authGuard]
  },
  {
    path: 'students/add',
    loadComponent: () =>
      import('./pages/add-student/add-student')
        .then(m => m.AddStudent),
    canActivate: [authGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'students/edit/:id',
    loadComponent: () =>
      import('./pages/edit-student/edit-student')
        .then(m => m.EditStudent),
    canActivate: [authGuard]
  },

  // FEATURE 3 - DEPARTMENT MANAGEMENT
  {
    path: 'departments',
    loadComponent: () =>
      import('./departments/department-list/department-list')
        .then(m => m.DepartmentList),
    canActivate: [authGuard]
  },
  {
    path: 'departments/add',
    loadComponent: () =>
      import('./departments/department-add/department-add')
        .then(m => m.DepartmentAdd),
    canActivate: [authGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'departments/edit/:id',
    loadComponent: () =>
      import('./departments/department-edit/department-edit')
        .then(m => m.DepartmentEdit),
    canActivate: [authGuard],
    data: { role: 'Admin' }
  },

  // KEEP THIS LAST
  {
    path: '**',
    redirectTo: ''
  }
];
