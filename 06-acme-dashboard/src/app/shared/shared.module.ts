import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModule } from './ui/ui.module';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  imports: [CommonModule, UiModule, MatPaginatorModule],
  exports: [UiModule, MatPaginatorModule],
})
export class SharedModule {}
