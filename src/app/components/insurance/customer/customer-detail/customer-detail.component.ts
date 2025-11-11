import {Component, inject, OnInit} from '@angular/core';
import {CustomerService} from "../../../../services/insurance/customer.service";
import {CreateCustomerRequest, CustomerDetail, CustomerMinimal} from "../../../../models/insurance/customerModel";
import {ActivatedRoute, Router} from "@angular/router";
import { Location } from '@angular/common';
import * as bootstrap from "bootstrap";


@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private customerService = inject(CustomerService);
  private location = inject(Location);
  editing = false;

  customer?: CustomerDetail;
  loading = true;
  error?: string;

  customers: CustomerMinimal[] = [];
  selectedCustomer: CreateCustomerRequest = this.emptyCustomer();
  isLoading = false;
  private router = inject(Router);
  private customerIdToDelete: string | null = null;
  currentCustomerId: string | null = null;
  private editCustomerData: any;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.customerService.getCustomerById(id).subscribe({
        next: (response) => {
          this.customer = response.data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'No se pudo cargar el cliente';
          this.loading = false;
        }
      });
    } else {
      this.error = 'ID no válido';
      this.loading = false;
    }

  }

  private emptyCustomer(): CreateCustomerRequest {
    return {
      firstName: '',
      lastName: '',
      documentType: 'CC',
      documentNumber: '',
      birthDate: '',
      email: '',
      phoneNumber: ''
    };
  }

  private closeModal(id: string) {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }

  private closeDeleteModal() {
    const modalEl = document.getElementById('deleteModal');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal?.hide();
    }
    this.customerIdToDelete = null;
  }

  editCustomer(customer: any) {
    console.log(customer);
    this.selectedCustomer = {
      firstName: customer.people?.firstName || '',
      lastName: customer.people?.lastName || '',
      documentType: customer.people?.documentType || 'CC',
      documentNumber: customer.people?.documentNumber || '',
      birthDate: customer.people?.birthDate || '',
      email: customer.email || '',
      phoneNumber: customer.phoneNumber || ''
    };
    console.log(this.selectedCustomer);
    const modal = new bootstrap.Modal(document.getElementById('customerModal')!);
    modal.show();
  }

  saveCustomer() {
    if (this.editing && this.currentCustomerId) {
      const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal')!);
      this.closeModal('customerModal');
      confirmModal.show();
      return;
    }
    this.customerService.createCustomer(this.selectedCustomer).subscribe({
      next: () => {
        this.loadCustomers();
        this.closeModal('customerModal');
      },
      error: () => alert('Ocurrió un error al crear el cliente.')
    });
  }

  openDeleteModal(customerId: string) {
    this.customerIdToDelete = customerId;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal')!);
    modal.show();
  }

  confirmDelete() {
    if (!this.customerIdToDelete) return;
    this.customerService.deleteCustomerById(this.customerIdToDelete).subscribe({
      next: () => {
        this.loadCustomers();
        this.closeDeleteModal();
      },
      error: (err) => console.error('Error eliminando cliente', err)
    });
  }

  confirmUpdate() {
    if (!this.customer?.id) return;
    this.customerService.updateCustomer(this.customer?.id, this.selectedCustomer).subscribe({
      next: () => {
        this.loadCustomers();
        this.closeModal('confirmModal');
        this.closeModal('customerModal');
      },
      error: () => alert('Ocurrió un error al actualizar el cliente.')
    });
  }

  loadCustomers() {
    this.isLoading = true;
    this.customerService.getAllCustomers().subscribe({
      next: (response) => {
        this.customers = Array.isArray(response.data) ? response.data : [response.data];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar clientes', err);
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.location.back();
  }

}
