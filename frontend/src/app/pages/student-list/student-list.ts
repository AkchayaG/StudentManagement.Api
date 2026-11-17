
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StudentService } from '../../services/student';
import { Student } from '../../models/student';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css'
})
export class StudentList implements OnInit {

  private studentService = inject(StudentService);
  private router = inject(Router);

  students = signal<Student[]>([]);
  loading = signal(false);
  error = signal('');

  keyword = '';
  isAdmin = false;
  isStaff = false;

  ngOnInit(): void {
    this.isAdmin = sessionStorage.getItem('role') === 'Admin';
    this.isStaff = sessionStorage.getItem('role') === 'Staff';
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading.set(true);
    this.error.set('');

    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Load students error:', err);
        this.error.set('Unable to load students.');
        this.loading.set(false);
      }
    });
  }

  search(): void {
    const keyword = this.keyword.trim();

    if (!keyword) {
      this.loadStudents();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.studentService.searchStudents(keyword).subscribe({
      next: (data) => {
        this.students.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Search error:', err);
        this.error.set('Search failed.');
        this.loading.set(false);
      }
    });
  }

  deleteStudent(id: number): void {
    if (!this.isAdmin) return;

    if (!confirm('Are you sure you want to delete this student?')) {
      return;
    }

    this.studentService.deleteStudent(id).subscribe({
      next: () => this.loadStudents(),
      error: (err) => {
        console.error('Delete error:', err);
        this.error.set('Unable to delete student.');
      }
    });
  }

  goBack(): void {
    this.router.navigate([
      this.isAdmin ? '/admin' : '/staff'
    ]);
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
