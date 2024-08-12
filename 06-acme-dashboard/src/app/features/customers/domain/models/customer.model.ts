export interface Customer {
  id: string;
  name: string;
  email: string;
  image_url: string;
  totalInvoices?: number;
  totalPending?: number;
  totalPaid?: number;
}
