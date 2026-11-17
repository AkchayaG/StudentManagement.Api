
import { Component, inject } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './staff-dashboard.html',
  styleUrl: './staff-dashboard.css'
})
export class StaffDashboard {
  auth = inject(Auth);
  private router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
  openDepartments() {
  this.router.navigate(['/departments']);
   }
}
