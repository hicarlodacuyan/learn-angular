import { Component } from '@angular/core';
import { MenuItem } from 'src/app/shared/ui/side-nav/menu-item.model';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css'],
})
export class InvoicesComponent {
  menuItems: MenuItem[] = [
    { link: '/dashboard', text: 'Home', icon: 'home' },
    { link: '/customers', text: 'Customers', icon: 'people' },
    { link: '/invoices', text: 'Invoices', icon: 'receipt' },
  ];
}
