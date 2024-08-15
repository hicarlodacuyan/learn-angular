import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentData,
  DocumentReference,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
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
            const q = ref.orderBy('name').limit(limit);
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

  searchCustomers(searchTerm: string): Observable<Customer[]> {
    return this.firestore
      .collection<Customer>('customers', (ref) =>
        ref
          .where('email', '>=', searchTerm)
          .where('email', '<=', searchTerm + '\uf8ff'),
      )
      .snapshotChanges()
      .pipe(
        switchMap((actions) => {
          const customers = actions.map((a) => {
            const customerData = a.payload.doc.data() as Customer;
            const customerRef = a.payload.doc.ref;
            return { ref: customerRef, ...customerData };
          });

          if (customers.length === 0) {
            return of([]);
          }

          const customersWithInvoices$ = customers.map((customer) =>
            this.getInvoices(customer.ref).pipe(
              map((invoices) => {
                const totalInvoicesCount = invoices.length;
                const totalPendingAmount = invoices
                  .filter((invoice) => invoice.status === 'pending')
                  .reduce((sum, invoice) => sum + invoice.amount, 0);
                const totalPaidAmount = invoices
                  .filter((invoice) => invoice.status === 'paid')
                  .reduce((sum, invoice) => sum + invoice.amount, 0);

                return {
                  ...customer,
                  totalInvoices: totalInvoicesCount,
                  totalPending: totalPendingAmount,
                  totalPaid: totalPaidAmount,
                };
              }),
            ),
          );

          return combineLatest(customersWithInvoices$);
        }),
      );
  }

  getInvoices(customerRef?: DocumentReference): Observable<Invoice[]> {
    if (!customerRef) {
      return this.firestore
        .collection<Invoice>('invoices')
        .valueChanges({ idField: 'id' });
    }

    return this.firestore
      .collection<Invoice>('invoices', (ref) =>
        ref.where('customer_id', '==', customerRef),
      )
      .valueChanges({ idField: 'id' });
  }

  //TODO: Refactor this method to use a single query to get customers invoice data
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
          const totalInvoicesCount = customerInvoices.length;
          const totalPendingAmount = customerInvoices
            .filter((invoice) => invoice.status === 'pending')
            .reduce((sum, invoice) => sum + invoice.amount, 0);
          const totalPaidAmount = customerInvoices
            .filter((invoice) => invoice.status === 'paid')
            .reduce((sum, invoice) => sum + invoice.amount, 0);

          return {
            ...customer,
            totalInvoices: totalInvoicesCount,
            totalPending: totalPendingAmount,
            totalPaid: totalPaidAmount,
          };
        });
      }),
    );
  }

  //getCustomersWithInvoiceData(
  //  limit: number,
  //  startAfter?: DocumentData,
  //): Observable<Customer[]> {
  //  return this.getCustomers(limit, startAfter).pipe(
  //    switchMap((customersSnapshot) => {
  //      const customers = customersSnapshot.docs.map((doc) => {
  //        const customerData = doc.data() as Customer;
  //        const customerRef = doc.ref;
  //        return { ref: customerRef, ...customerData };
  //      });
  //
  //      if (customers.length === 0) {
  //        return of([]);
  //      }
  //
  //      const customersWithInvoices$ = customers.map((customer) =>
  //        this.getInvoices(customer.ref).pipe(
  //          map((invoices) => {
  //            const totalInvoicesCount = invoices.length;
  //            const totalPendingAmount = invoices
  //              .filter((invoice) => invoice.status === 'pending')
  //              .reduce((sum, invoice) => sum + invoice.amount, 0);
  //            const totalPaidAmount = invoices
  //              .filter((invoice) => invoice.status === 'paid')
  //              .reduce((sum, invoice) => sum + invoice.amount, 0);
  //
  //            return {
  //              ...customer,
  //              totalInvoices: totalInvoicesCount,
  //              totalPending: totalPendingAmount,
  //              totalPaid: totalPaidAmount,
  //            };
  //          }),
  //        ),
  //      );
  //
  //      return combineLatest(customersWithInvoices$);
  //    }),
  //  );
  //}

  getCustomersCount(): Observable<number> {
    return this.firestore
      .collection('customers')
      .get()
      .pipe(map((snapshot) => snapshot.size));
  }
}
