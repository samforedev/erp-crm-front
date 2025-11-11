import {Component, inject, OnInit} from '@angular/core';
import {UserService} from "../../../../services/insurance/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {UserDetail} from "../../../../models/insurance/userModel";
import {CustomerService} from "../../../../services/insurance/customer.service";
import {assignedAgent, CustomerMinimal, GetAllByAgentId} from "../../../../models/insurance/customerModel";
import * as bootstrap from "bootstrap";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  private userService = inject(UserService);
  private customerService = inject(CustomerService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private router = inject(Router);

  loading = true;
  error?: string;
  user?: UserDetail;
  customersAgent?: GetAllByAgentId;
  showCustomers = false;
  availableCustomers: CustomerMinimal[] = [];

  ngOnInit(): void {
    this.initialUserData();
  }

  customerDetails(customerId: string) {
    this.closeModal('customerModal');
    this.router.navigate(['/crm/customers', customerId]).then();
  }

  goBack() {
    this.location.back();
  }

  toggleCustomers() {
    this.showCustomers = !this.showCustomers;

    if (this.showCustomers && !this.customersAgent && this.user) {
      this.loadCustomersForAgent(this.user.id);
    }
  }

  openAddModal() {
    const modalElement = document.getElementById('customerModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
      this.customerService.getAllCustomers().subscribe({
        next: (response) => {
          const allCustomers: CustomerMinimal[] = Array.isArray(response.data)
            ? response.data
            : [];
          const assignedIds = this.customersAgent?.customers?.map((c: any) => c.id) || [];
          this.availableCustomers = allCustomers.filter(
            (c) => !assignedIds.includes(c.id)
          );
          console.log(this.availableCustomers);
        },
        error: (err) => {
          console.error('Error al obtener clientes:', err);
          this.availableCustomers = [];
        },
      });
    }
  }

  assignCustomer(customerId: string) {
    const request: assignedAgent = {
      agentId: this.user!.id
    }
    this.customerService.assignAgent(customerId, request).subscribe({
      next: () => {
        this.loadCustomersForAgent(this.user!.id);
        this.closeModal('customerModal');
      },
      error: (err) => {
        console.error('Error al asignar cliente:', err);
        alert('No se pudo asignar el cliente.');
      }
    });
  }


  private loadCustomersForAgent(agentId: string) {
    console.log('Load CustomersForAgent');
    console.log(this.user?.id)
    this.customerService.getAllByAgentId(agentId).subscribe({
      next: (response) => {
        this.customersAgent = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      }
    })
  }

  private initialUserData(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === undefined) {
      this.error = 'ID no válido';
      this.loading = false;
      return;
    }
    if (id) {
      this.userService.getUserById(id).subscribe({
        next: (response) => {
          this.user = response.data;
          this.loading = false;
          this.loadCustomersForAgent(this.user.id);
        },
        error: (err) => {
          this.error = 'No se pudo cargar el cliente';
          this.loading = false;
        }
      });
    }
  }

  private closeModal(id: string) {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }

}
