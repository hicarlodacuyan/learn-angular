import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { Customer } from '../../domain/models/customer.model';
import { Invoice } from '../../domain/models/invoice.model';

@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  constructor(private firestore: AngularFirestore) {}

  private getDocumentSnapshot(docId: string) {
    return this.firestore
      .collection<DocumentData>('invoices')
      .doc(docId)
      .get()
      .pipe(
        map((docSnapshot) => (docSnapshot.exists ? docSnapshot : undefined)),
      );
  }

  getInvoices(limit: number, startAfter?: DocumentData) {
    return this.getDocumentSnapshot(startAfter?.['id']).pipe(
      switchMap((docSnapshot) => {
        const query = this.firestore
          .collection<DocumentData>('invoices', (ref) => {
            const q = ref.orderBy('date').limit(limit);
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

  getCustomers(): Observable<Customer[]> {
    return this.firestore
      .collection<Customer>('customers')
      .valueChanges({ idField: 'id' });
  }

  getInvoicesWithCustomerData(
    limit: number,
    startAfter?: DocumentData,
  ): Observable<Invoice[]> {
    return combineLatest([
      this.getInvoices(limit, startAfter),
      this.getCustomers(),
    ]).pipe(
      map(([invoicesSnapshot, customers]) => {
        const invoices = invoicesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Omit<Invoice, 'customer'>[];

        return invoices.map((invoice) => {
          const customer =
            customers.find((customer) => {
              return customer.id === invoice.customer_id.id;
            }) || ({ id: '', name: '', email: '', image_url: '' } as Customer);

          return {
            ...invoice,
            customer,
          };
        });
      }),
    );
  }

  getCustomersByEmail(email: string): Observable<Customer[]> {
    return this.firestore
      .collection<Customer>('customers', (ref) =>
        ref.where('email', '>=', email).where('email', '<=', email + '\uf8ff'),
      )
      .valueChanges({ idField: 'id' });
  }

  getInvoicesByCustomerIds(customerIds: string[]): Observable<Invoice[]> {
    if (customerIds.length === 0) {
      return of([]);
    }

    const customerRefs = customerIds.map(
      (id) => this.firestore.doc(`customers/${id}`).ref,
    );

    return this.firestore
      .collection<Invoice>('invoices', (ref) =>
        ref.where('customer_id', 'in', customerRefs),
      )
      .valueChanges();
  }

  searchInvoices(searchTerm: string): Observable<Invoice[]> {
    return this.getCustomersByEmail(searchTerm).pipe(
      switchMap((customers) => {
        const customerIds = customers.map((customer) => customer.id);
        if (customerIds.length === 0) {
          return of([]);
        }
        return this.getInvoicesByCustomerIds(customerIds);
      }),
      switchMap((invoices) => {
        if (invoices.length === 0) {
          return of([]);
        }
        return combineLatest([this.getCustomers(), of(invoices)]).pipe(
          map(([customers, invoices]) => {
            return invoices.map((invoice) => {
              const customer = customers.find(
                (customer) => customer.id === invoice.customer_id.id,
              );

              return {
                ...invoice,
                customer: customer || {
                  id: '',
                  name: '',
                  email: '',
                  image_url: '',
                },
              };
            });
          }),
        );
      }),
    );
  }

  getInvoicesCount(): Observable<number> {
    return this.firestore
      .collection('invoices')
      .get()
      .pipe(map((snapshot) => snapshot.size));
  }
}
