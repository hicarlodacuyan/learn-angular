import { Injectable } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import { combineLatest, map, Observable } from 'rxjs';
import { CustomersService } from '../../data/services/customers.service';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class GetCustomersUseCase {
  constructor(private customersService: CustomersService) {}

  execute(
    limit: number,
    startAfter?: DocumentData,
  ): Observable<{ customers: Customer[]; total: number }> {
    return combineLatest([
      this.customersService.getCustomersWithInvoiceData(limit, startAfter),
      this.customersService.getCustomersCount(),
    ]).pipe(map(([customers, total]) => ({ customers, total })));
  }

  searchCustomers(term: string): Observable<Customer[]> {
    return this.customersService.searchCustomers(term);
  }
}
