import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesComponent } from './invoices.component';
import { RouterModule, Routes } from '@angular/router';
import { CreateInvoiceComponent } from './presentation/components/create-invoice/create-invoice.component';

const routes: Routes = [
  { path: '', component: InvoicesComponent },
  { path: 'create', component: CreateInvoiceComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoicesRoutingModule {}
