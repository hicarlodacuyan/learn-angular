import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { MenuItem } from './menu-item.model';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent {
  @Input() menuItems: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onLogout() {
    this.authService
      .logout()
      .then((_) => {
        this.authService.redirectToLogin();
      })
      .catch((error) => {
        console.error('Logout error', error);
      });
  }

  isActive(link: string): boolean {
    return this.router.url === link;
  }
}
