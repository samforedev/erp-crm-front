import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import {authGuard} from "./guards/auth.guard";
import {MainLayoutComponent} from "./components/layaout/main-layout/main-layout.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {CustomerComponent} from "./components/insurance/customer/customer.component";
import {CustomerDetailComponent} from "./components/insurance/customer/customer-detail/customer-detail.component";
import {UsersComponent} from "./components/insurance/users/users.component";
import {UserDetailComponent} from "./components/insurance/users/user-detail/user-detail.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: DashboardComponent },
      { path: 'erp/users', component: UsersComponent },
      { path: 'erp/users/:id', component: UserDetailComponent },
      { path: 'crm/customers', component: CustomerComponent },
      { path: 'crm/customers/:id', component: CustomerDetailComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
