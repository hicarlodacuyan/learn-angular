import { Component } from '@angular/core';
import { MenuItem } from 'src/app/shared/ui/side-nav/menu-item.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  menuItems: MenuItem[] = [
    { link: '/dashboard', text: 'Home', icon: 'home' },
    { link: '/customers', text: 'Customers', icon: 'people' },
    { link: '/invoices', text: 'Invoices', icon: 'receipt' },
  ];
}
