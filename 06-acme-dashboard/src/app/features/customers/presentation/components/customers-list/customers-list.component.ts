import { Component, OnInit, ViewChild } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { Customer } from '../../../domain/models/customer.model';
import { GetCustomersUseCase } from '../../../domain/use-cases/get-customers.use-case';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.css'],
})
export class CustomersListComponent implements OnInit {
  customers$: Observable<Customer[]> = of([]);
  totalCustomers: number = 0;
  displayedColumns: string[] = [
    'pictureAndName',
    'email',
    'totalInvoices',
    'totalPending',
    'totalPaid',
  ];
  dataSource = new MatTableDataSource<Customer>([]);
  pageSize = 5;
  currentPageIndex = 0;
  private lastDocument: DocumentData | undefined = undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private getCustomersUseCase: GetCustomersUseCase) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(startAfter?: DocumentData): void {
    console.log('Loading customers with startAfter:', startAfter);

    this.getCustomersUseCase.execute(this.pageSize, startAfter).subscribe({
      next: ({ customers, total }) => {
        console.log('Received customers:', customers);
        console.log('Total customers:', total);

        // Check if we received customers
        if (customers.length > 0) {
          this.dataSource.data = customers;
          this.customers$ = of(customers);
          this.totalCustomers = total;

          // Update lastDocument for pagination
          this.lastDocument = customers[customers.length - 1];

          // Update the paginator state
          if (this.paginator) {
            this.paginator.pageIndex = this.currentPageIndex;
            this.paginator.pageSize = this.pageSize;
          }

          console.log('Updated lastDocument:', this.lastDocument);
        } else {
          console.log('No more data available for pagination.');
          this.lastDocument = undefined;
          this.dataSource.data = [];
        }
      },
      error: (error) => {
        console.error('Error loading customers:', error);
      },
    });
  }

  onPageChange(event: PageEvent): void {
    console.log('Page changed:', event);

    this.currentPageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    // Calculate the startAfter document
    const startAfter =
      this.currentPageIndex > 0 ? this.lastDocument : undefined;

    console.log('Fetching data with startAfter:', startAfter);

    this.loadCustomers(startAfter);
  }
}
