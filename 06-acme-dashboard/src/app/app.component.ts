import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { MenuItem } from './shared/ui/side-nav/menu-item.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = '06-acme-dashboard';
  showSideNav = true;
  menuItems: MenuItem[] = [
    { link: '/dashboard', text: 'Home', icon: 'home' },
    { link: '/invoices', text: 'Invoices', icon: 'receipt' },
    { link: '/customers', text: 'Customers', icon: 'people' },
  ];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showSideNav = !['/login', '/signup'].includes(event.url);
      });
  }
}
