
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DepartmentService } from '../department.service';

@Component({
  selector: 'app-department-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-add.html',
  styleUrl: './department-add.css'
})
export class DepartmentAdd {
  private service = inject(DepartmentService);
  private router = inject(Router);

  code = '';
  name = '';
  description = '';

  saving = signal(false);
  error = signal('');

  save() {
    if (!this.code.trim() || !this.name.trim()) {
      this.error.set('Code and department name are required');
      return;
    }

    this.saving.set(true);
    this.error.set('');

    this.service.add({
      code: this.code.trim(),
      name: this.name.trim(),
      description: this.description.trim()
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/departments']);
      },
      error: (err) => {
        this.error.set(
          err.status === 409
            ? 'Department code already exists'
            : 'Unable to add department'
        );
        this.saving.set(false);
      }
    });
  }

  cancel() {
    this.router.navigate(['/departments']);
  }
}
