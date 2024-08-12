import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentData,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import { combineLatest, map, Observable, switchMap } from 'rxjs';
import { Customer } from '../../domain/models/customer.model';
import { Invoice } from '../../domain/models/invoice.model';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  constructor(private firestore: AngularFirestore) {}

  private getDocumentSnapshot(docId: string) {
    return this.firestore
      .collection<DocumentData>('customers')
      .doc(docId)
      .get()
      .pipe(
        map((docSnapshot) => (docSnapshot.exists ? docSnapshot : undefined)),
      );
  }

  getCustomers(
    limit: number,
    startAfter?: DocumentData,
  ): Observable<QuerySnapshot<DocumentData>> {
    return this.getDocumentSnapshot(startAfter?.['id']).pipe(
      switchMap((docSnapshot) => {
        const query = this.firestore
          .collection<DocumentData>('customers', (ref) => {
            let q = ref.orderBy('name').limit(limit);
            if (docSnapshot) {
              return q.startAfter(docSnapshot);
            }
            return q;
          })
          .get();

        return query;
      }),
    );
  }

  getInvoices(): Observable<Invoice[]> {
    return this.firestore
      .collection<Invoice>('invoices')
      .valueChanges({ idField: 'id' });
  }

  getCustomersWithInvoiceData(
    limit: number,
    startAfter?: DocumentData,
  ): Observable<Customer[]> {
    return combineLatest([
      this.getCustomers(limit, startAfter),
      this.getInvoices(),
    ]).pipe(
      map(([customersSnapshot, invoices]) => {
        const customers = customersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Customer[];

        return customers.map((customer) => {
          const customerRef = `customers/${customer.id}`;
          const customerInvoices = invoices.filter(
            (invoice) => invoice.customer_id.path === customerRef,
          );
          const totalInvoicesAmount = customerInvoices.reduce(
            (sum, invoice) => sum + invoice.amount,
            0,
          );
          const totalPendingAmount = customerInvoices
            .filter((invoice) => invoice.status === 'pending')
            .reduce((sum, invoice) => sum + invoice.amount, 0);
          const totalPaidAmount = customerInvoices
            .filter((invoice) => invoice.status === 'paid')
            .reduce((sum, invoice) => sum + invoice.amount, 0);

          return {
            ...customer,
            totalInvoices: totalInvoicesAmount,
            totalPending: totalPendingAmount,
            totalPaid: totalPaidAmount,
          };
        });
      }),
    );
  }

  getCustomersCount(): Observable<number> {
    return this.firestore
      .collection('customers')
      .get()
      .pipe(map((snapshot) => snapshot.size));
  }
}
