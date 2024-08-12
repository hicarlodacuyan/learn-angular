import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { MenuItem } from './menu-item.model';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent {
  @Input() menuItems: MenuItem[] = [];

  constructor(private authService: AuthService) {}

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
}
