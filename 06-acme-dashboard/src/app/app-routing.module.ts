import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ProfileComponent } from './features/auth/profile/profile.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthRedirectGuard } from './core/guards/auth-redirect.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthRedirectGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [AuthRedirectGuard],
  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'customers',
    loadChildren: () =>
      import('./features/customers/customers.module').then(
        (m) => m.CustomersModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'invoices',
    loadChildren: () =>
      import('./features/invoices/invoices.module').then(
        (m) => m.InvoicesModule,
      ),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
