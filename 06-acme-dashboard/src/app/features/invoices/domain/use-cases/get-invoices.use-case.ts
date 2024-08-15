import { Injectable } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import { combineLatest, map, Observable } from 'rxjs';
import { InvoicesService } from '../../data/services/invoices.service';
import { Invoice } from '../models/invoice.model';

@Injectable({
  providedIn: 'root',
})
export class GetInvoicesUseCase {
  constructor(private invoicesService: InvoicesService) {}

  execute(
    limit: number,
    startAfter?: DocumentData,
  ): Observable<{ invoices: Invoice[]; total: number }> {
    return combineLatest([
      this.invoicesService.getInvoicesWithCustomerData(limit, startAfter),
      this.invoicesService.getInvoicesCount(),
    ]).pipe(map(([invoices, total]) => ({ invoices, total })));
  }

  searchInvoices(term: string): Observable<Invoice[]> {
    return this.invoicesService.searchInvoices(term);
  }
}
