import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersRoutingModule } from './customers-routing.module';
import { MatTableModule } from '@angular/material/table';
import { CustomersComponent } from './customers.component';
import { CustomersListComponent } from './presentation/components/customers-list/customers-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CustomersComponent, CustomersListComponent],
  imports: [
    CommonModule,
    MatTableModule,
    CustomersRoutingModule,
    MatPaginatorModule,
    SharedModule,
  ],
})
export class CustomersModule {}
