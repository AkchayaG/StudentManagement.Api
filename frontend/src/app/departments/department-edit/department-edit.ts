
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../department.service';

@Component({
  selector: 'app-department-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-edit.html',
  styleUrl: './department-edit.css'
})
export class DepartmentEdit {
  private service = inject(DepartmentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id = Number(this.route.snapshot.paramMap.get('id'));

  code = '';
  name = '';
  description = '';

  loading = signal(true);
  saving = signal(false);
  error = signal('');

  ngOnInit() {
    this.service.getById(this.id).subscribe({
      next: (data) => {
        this.code = data.code;
        this.name = data.name;
        this.description = data.description;
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load department');
        this.loading.set(false);
      }
    });
  }

  update() {
    if (!this.code.trim() || !this.name.trim()) {
      this.error.set('Code and name are required');
      return;
    }

    this.saving.set(true);
    this.error.set('');

    this.service.update(this.id, {
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
            : 'Unable to update department'
        );
        this.saving.set(false);
      }
    });
  }

  cancel() {
    this.router.navigate(['/departments']);
  }
}
