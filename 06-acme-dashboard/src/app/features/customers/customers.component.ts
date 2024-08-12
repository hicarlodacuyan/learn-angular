import { Component } from '@angular/core';
import { MenuItem } from 'src/app/shared/ui/side-nav/menu-item.model';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent {
  menuItems: MenuItem[] = [
    { link: '/dashboard', text: 'Home', icon: 'home' },
    { link: '/customers', text: 'Customers', icon: 'people' },
    { link: '/invoices', text: 'Invoices', icon: 'receipt' },
  ];
}
