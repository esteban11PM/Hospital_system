import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: any;

  menuItems = [
    { icon: 'people', label: 'Pacientes', route: '/patients' },
    { icon: 'local_hospital', label: 'Doctores', route: '/doctors' },
    { icon: 'event', label: 'Citas', route: '/appointments' },
    { icon: 'school', label: 'Especialidades', route: '/specialties' },
    { icon: 'meeting_room', label: 'Consultorios', route: '/consulting-rooms' }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.currentUser = this.authService.getCurrentUser();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}