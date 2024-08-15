import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { InvoicesRoutingModule } from './invoices-routing.module';
import { InvoicesComponent } from './invoices.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { InvoicesListComponent } from './presentation/components/invoices-list/invoices-list.component';
import { TimestampToDatePipe } from 'src/app/core/pipes/timestamp-to-date.pipe';

@NgModule({
  declarations: [InvoicesComponent, InvoicesListComponent, TimestampToDatePipe],
  imports: [CommonModule, MatTableModule, SharedModule, InvoicesRoutingModule],
})
export class InvoicesModule {}
