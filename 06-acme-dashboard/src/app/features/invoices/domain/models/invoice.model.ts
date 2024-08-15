import { Customer } from './customer.model';

export interface Invoice {
  id: string;
  amount: number;
  customer_id: firebase.default.firestore.DocumentReference;
  date: firebase.default.firestore.Timestamp;
  status: 'paid' | 'pending';
  customer: Customer;
}
