import {Component, inject, OnInit} from '@angular/core';
import {UserService} from "../../../../services/insurance/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {UserDetail} from "../../../../models/insurance/userModel";
import {CustomerService} from "../../../../services/insurance/customer.service";
import {GetAllByAgentId} from "../../../../models/insurance/customerModel";

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

  ngOnInit(): void {
    this.initialUserData();
  }

  customerDetails(customerId: string) {
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

}
