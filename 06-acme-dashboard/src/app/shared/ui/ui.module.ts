import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { LinkComponent } from './link/link.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { LogoComponent } from './logo/logo.component';

@NgModule({
  declarations: [
    LinkComponent,
    SideNavComponent,
    PaginatorComponent,
    LogoComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatPaginatorModule,
    RouterModule,
  ],
  exports: [
    LinkComponent,
    SideNavComponent,
    PaginatorComponent,
    LogoComponent,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
})
export class UiModule {}
