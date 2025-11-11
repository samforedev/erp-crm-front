import {Component, inject, OnInit} from '@angular/core';
import * as bootstrap from 'bootstrap';
import {CustomerService} from "../../../services/insurance/customer.service";
import {CreateCustomerRequest, CustomerMinimal} from "../../../models/insurance/customerModel";
import {Router} from "@angular/router";

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  private customerService = inject(CustomerService);
  customers: CustomerMinimal[] = [];
  selectedCustomer: CreateCustomerRequest = this.emptyCustomer();
  isLoading = false;
  private router = inject(Router);
  private customerIdToDelete: string | null = null;
  currentCustomerId: string | null = null;
  private editCustomerData: any;

  ngOnInit(): void {
    this.loadCustomers();
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

  editing = false;

  openAddModal() {
    this.selectedCustomer = this.emptyCustomer();
    const modalElement = document.getElementById('customerModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
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

  confirmUpdate() {
    if (!this.currentCustomerId) return;
    this.customerService.updateCustomer(this.currentCustomerId, this.selectedCustomer).subscribe({
      next: () => {
        this.loadCustomers();
        this.closeModal('confirmModal');
        this.closeModal('customerModal');
      },
      error: () => alert('Ocurrió un error al actualizar el cliente.')
    });
  }

  private closeModal(id: string) {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }

  editCustomer(customer: any) {
    this.editing = true;
    this.currentCustomerId = customer.id;

    this.customerService.getCustomerById(customer.id).subscribe({
      next: (response) => {
        this.editCustomerData = response.data;
        this.selectedCustomer = {
          firstName: this.editCustomerData.people?.firstName || '',
          lastName: this.editCustomerData.people?.lastName || '',
          documentType: this.editCustomerData.people?.documentType || 'CC',
          documentNumber: this.editCustomerData.people?.documentNumber || '',
          birthDate: this.editCustomerData.people?.birthDate || '',
          email: this.editCustomerData.email || '',
          phoneNumber: this.editCustomerData.phoneNumber || ''
        };
        const modal = new bootstrap.Modal(document.getElementById('customerModal')!);
        modal.show();
      },
      error: (err) => {
        alert('No se pudo cargar la información del cliente.');
      }
    });
  }

  customerDetails(customerId: string) {
    this.router.navigate(['/crm/customers', customerId]).then();
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

  closeDeleteModal() {
    const modalEl = document.getElementById('deleteModal');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal?.hide();
    }
    this.customerIdToDelete = null;
  }

}
