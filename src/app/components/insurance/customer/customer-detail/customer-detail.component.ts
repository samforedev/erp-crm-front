import {Component, inject, OnInit} from '@angular/core';
import {CustomerService} from "../../../../services/insurance/customer.service";
import {
  changeCustomerStatus,
  CreateCustomerRequest,
  CustomerDetail,
  CustomerMinimal
} from "../../../../models/insurance/customerModel";
import {ActivatedRoute, Router} from "@angular/router";
import { Location } from '@angular/common';
import * as bootstrap from "bootstrap";
import Swal from 'sweetalert2';
import {ApiErrorResponse} from "../../../../models/apiResponse";


@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private customerService = inject(CustomerService);
  private location = inject(Location);

  customer?: CustomerDetail;
  selectedStatus: string = '';
  loading = true;
  error?: string;
  showEditDetail = false;


  ngOnInit(): void {
    this.loadCustomerData();
  }

  updateCustomerStatus() {
    if (!this.customer) return;
    const id = this.customer.id;
    const newStatus = this.selectedStatus;

    const req: changeCustomerStatus = {
      customerId: id,
      customerStatus: newStatus,
    }

    this.closeModal('editStatusModal');

    this.customerService.updateCustomerStatus(req).subscribe({
      next: (res) => {
        this.customer!.customerStatus = newStatus;
        Swal.fire({
          icon: 'success',
          title: 'Estado actualizado',
          text: `El estado del cliente se cambió a ${newStatus}`,
          confirmButtonColor: '#354f7d'
        }).then((result) => {

        });
      },
      error: (err: ApiErrorResponse<changeCustomerStatus>) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.errorMessage
        }).then((result) => {});
      }
    });
  }

  goBack() {
    this.location.back();
  }

  private loadCustomerData() {
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

  private closeModal(id: string) {
    const modalEl = document.getElementById(id);
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modal.hide();

      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(b => b.remove());
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('padding-right');
    }
  }

}
