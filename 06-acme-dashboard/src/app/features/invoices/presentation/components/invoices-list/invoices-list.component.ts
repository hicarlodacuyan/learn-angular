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
import { Invoice } from '../../../domain/models/invoice.model';
import { GetInvoicesUseCase } from '../../../domain/use-cases/get-invoices.use-case';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.css'],
})
export class InvoicesListComponent implements OnInit {
  invoices$: Observable<Invoice[]> = of([]);
  totalInvoices: number = 0;
  displayedColumns: string[] = [
    'pictureAndName',
    'email',
    'amount',
    'date',
    'status',
  ];
  dataSource = new MatTableDataSource<Invoice>([]);
  pageSize = 5;
  currentPageIndex = 0;
  private lastDocument: DocumentData | undefined = undefined;
  private searchSubject: Subject<string> = new Subject<string>();
  private searchTerm: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private getInvoicesUseCase: GetInvoicesUseCase) {}

  ngOnInit(): void {
    this.loadInvoices();

    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          this.searchTerm = term;
          if (term) {
            return this.searchInvoices(term);
          } else {
            this.currentPageIndex = 0;
            return this.getPaginatedInvoices();
          }
        }),
      )
      .subscribe({
        next: (invoices) => {
          this.invoices$ = of(invoices);
          this.dataSource.data = invoices;
        },
        error: (error) => {
          console.error('Error during search or pagination:', error);
        },
      });
  }

  loadInvoices(startAfter?: DocumentData): void {
    this.getInvoicesUseCase.execute(this.pageSize, startAfter).subscribe({
      next: ({ invoices, total }) => {
        if (invoices.length > 0) {
          this.invoices$ = of(invoices);
          this.dataSource.data = invoices;
          this.totalInvoices = total;
          this.lastDocument = invoices[invoices.length - 1];
          if (this.paginator) {
            this.paginator.pageIndex = this.currentPageIndex;
            this.paginator.pageSize = this.pageSize;
          }
        } else {
          this.lastDocument = undefined;
          this.invoices$ = of([]);
          this.dataSource.data = [];
        }
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
      },
    });
  }

  searchInvoices(term: string): Observable<Invoice[]> {
    return this.getInvoicesUseCase.searchInvoices(term).pipe(
      map((invoices) => {
        this.totalInvoices = invoices.length;
        if (this.paginator) {
          this.paginator.pageIndex = 0;
          this.paginator.pageSize = invoices.length;
        }
        return invoices;
      }),
    );
  }

  getPaginatedInvoices(): Observable<Invoice[]> {
    const startAfter =
      this.currentPageIndex > 0 ? this.lastDocument : undefined;

    return new Observable<Invoice[]>((observer) => {
      this.loadInvoices(startAfter);
      this.invoices$.subscribe((invoices) => observer.next(invoices));
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    if (this.searchTerm) {
      this.searchInvoices(this.searchTerm).subscribe((invoices) => {
        this.invoices$ = of(invoices);
        this.dataSource.data = invoices;
      });
    } else {
      this.getPaginatedInvoices().subscribe((invoices) => {
        this.invoices$ = of(invoices);
        this.dataSource.data = invoices;
      });
    }
  }

  onSearch(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }
}
