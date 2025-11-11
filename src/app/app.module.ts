import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { ErrorInterceptor } from "./interceptors/error.interceptor";
import {LoginComponent} from './components/auth/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthInterceptor} from "./interceptors/auth.interceptor";
import { MainLayoutComponent } from './components/layaout/main-layout/main-layout.component';
import { NavbarComponent } from './components/layaout/navbar/navbar.component';
import { SidebarComponent } from './components/layaout/sidebar/sidebar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CustomerComponent } from './components/insurance/customer/customer.component';
import {CustomerInterceptor} from "./interceptors/customer.interceptor";
import { CustomerDetailComponent } from './components/insurance/customer/customer-detail/customer-detail.component';
import { UsersComponent } from './components/insurance/users/users.component';
import {UserInterceptor} from "./interceptors/user.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainLayoutComponent,
    NavbarComponent,
    SidebarComponent,
    DashboardComponent,
    CustomerComponent,
    CustomerDetailComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CustomerInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: UserInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
