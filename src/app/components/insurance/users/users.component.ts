import {Component, inject, OnInit} from '@angular/core';
import {UserService} from "../../../services/insurance/user.service";
import {UserMinimal} from "../../../models/insurance/userModel";
import {ApiSuccessResponse} from "../../../models/apiResponse";
import {Router} from "@angular/router";
import * as bootstrap from "bootstrap";
import {AuthService} from "../../../services/auth/auth.service";
import {RegisterRequest} from "../../../models/auth/authModels";
import Swal from "sweetalert2";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private isLoading: boolean = false;


  users: UserMinimal[] = [];
  newUser: RegisterRequest = {
    firstName: '',
    lastName: '',
    documentType: 'CC',
    documentNumber: '',
    birthDate: '',
    phoneNumber: '',
    jobTitle: '',
    username: '',
    email: '',
    password: '',
    initialRoleName: 'USER'
  };

  ngOnInit(): void {
    this.loadUsers();
  }

  openAddModal() {
    const modalElement = document.getElementById('userModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  registerUser() {
    this.authService.register(this.newUser).subscribe({
      next: (res) => {
        this.closeModal('userModal');
        Swal.fire({
          icon: 'success',
          title: 'Usuario registrado',
          text: 'El nuevo usuario ha sido creado exitosamente.',
          confirmButtonColor: '#354f7d'
        });
        this.loadUsers();
        this.newUser = {
          firstName: '',
          lastName: '',
          documentType: 'CC',
          documentNumber: '',
          birthDate: '',
          phoneNumber: '',
          jobTitle: '',
          username: '',
          email: '',
          password: '',
          initialRoleName: 'USER'
        };
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: err.error?.errorMessage || 'Ocurrió un error inesperado.'
        });
      }
    });
  }

  closeModal(modalId: string) {
    const modalEl = document.getElementById(modalId);
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) {
        modal.hide();
      }
      document.body.classList.remove('modal-open');
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    }
  }

  gotoUserDetails(userId: string): void {
    this.router.navigate(['/erp/users', userId]).then();
  }

  private loadUsers() {
    this.isLoading = true;
    const request = {
      status: "ACTIVE",
    }
    this.userService.getAllUsers(request).subscribe({
      next: (response: ApiSuccessResponse<UserMinimal[]>) => {
        this.users = Array.isArray(response.data) ? response.data : [response.data];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

}
