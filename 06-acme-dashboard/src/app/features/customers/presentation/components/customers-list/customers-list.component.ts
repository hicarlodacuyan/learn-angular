import { Component, OnInit, ViewChild } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  Subject,
  switchMap,
} from 'rxjs';
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
  private searchSubject: Subject<string> = new Subject<string>();
  private searchTerm: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private getCustomersUseCase: GetCustomersUseCase) {}

  ngOnInit(): void {
    this.loadCustomers();

    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          this.searchTerm = term;
          if (term) {
            return this.searchCustomers(term);
          } else {
            this.currentPageIndex = 0;
            return this.getPaginatedCustomers();
          }
        }),
      )
      .subscribe({
        next: (customers) => {
          this.customers$ = of(customers);
          this.dataSource.data = customers;
        },
        error: (error) => {
          console.error('Error during search or pagination:', error);
        },
      });
  }

  loadCustomers(startAfter?: DocumentData): void {
    this.getCustomersUseCase.execute(this.pageSize, startAfter).subscribe({
      next: ({ customers, total }) => {
        if (customers.length > 0) {
          this.customers$ = of(customers);
          this.dataSource.data = customers;
          this.totalCustomers = total;
          this.lastDocument = customers[customers.length - 1];
          if (this.paginator) {
            this.paginator.pageIndex = this.currentPageIndex;
            this.paginator.pageSize = this.pageSize;
          }
        } else {
          this.lastDocument = undefined;
          this.customers$ = of([]);
          this.dataSource.data = [];
        }
      },
      error: (error) => {
        console.error('Error loading customers:', error);
      },
    });
  }

  searchCustomers(term: string): Observable<Customer[]> {
    return this.getCustomersUseCase.searchCustomers(term).pipe(
      map((customers) => {
        this.totalCustomers = customers.length;
        if (this.paginator) {
          this.paginator.pageIndex = 0;
          this.paginator.pageSize = customers.length;
        }
        return customers;
      }),
    );
  }

  getPaginatedCustomers(): Observable<Customer[]> {
    const startAfter =
      this.currentPageIndex > 0 ? this.lastDocument : undefined;

    return new Observable<Customer[]>((observer) => {
      this.loadCustomers(startAfter);
      this.customers$.subscribe((customers) => observer.next(customers));
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.searchTerm) {
      this.searchCustomers(this.searchTerm).subscribe((customers) => {
        this.customers$ = of(customers);
        this.dataSource.data = customers;
      });
    } else {
      this.getPaginatedCustomers().subscribe((customers) => {
        this.customers$ = of(customers);
        this.dataSource.data = customers;
      });
    }
  }

  onSearch(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }
}
