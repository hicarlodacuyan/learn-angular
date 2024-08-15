import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { LinkComponent } from './link/link.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { LogoComponent } from './logo/logo.component';
import { SearchComponent } from './search/search.component';
import { StatusChipComponent } from './status-chip/status-chip.component';

@NgModule({
  declarations: [
    LinkComponent,
    SideNavComponent,
    PaginatorComponent,
    LogoComponent,
    SearchComponent,
    StatusChipComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatChipsModule,
    RouterModule,
  ],
  exports: [
    LinkComponent,
    SideNavComponent,
    PaginatorComponent,
    LogoComponent,
    SearchComponent,
    StatusChipComponent,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    RouterModule,
  ],
})
export class UiModule {}
