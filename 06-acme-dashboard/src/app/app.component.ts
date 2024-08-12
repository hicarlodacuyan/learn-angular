import { Component } from '@angular/core';
import { MenuItem } from './shared/ui/side-nav/menu-item.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = '06-acme-dashboard';
  menuItems: MenuItem[] = [
    { link: '/dashboard', text: 'Home', icon: 'home' },
    { link: '/customers', text: 'Customers', icon: 'people' },
    { link: 'invoices', text: 'Invoices', icon: 'receipt' },
  ];
}
