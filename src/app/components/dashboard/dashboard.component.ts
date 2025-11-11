import { Component, inject, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CustomerService } from '../../services/insurance/customer.service';
import { UserService } from '../../services/insurance/user.service';
import { CustomerMinimal } from '../../models/insurance/customerModel';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private customerService = inject(CustomerService);
  private userService = inject(UserService);

  summaryCards = [
    { title: 'Total Empleados', value: 0, icon: 'bi bi-person-workspace', bgColor: 'bg-success' },
    { title: 'Total Clientes', value: 0, icon: 'bi bi-people', bgColor: 'bg-info' },
    { title: 'Activos', value: 0, icon: 'bi bi-check-circle', bgColor: 'bg-primary' },
    { title: 'Inactivos', value: 0, icon: 'bi bi-x-circle', bgColor: 'bg-danger' },
  ];

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.customerService.getAllCustomers().subscribe({
      next: (res) => {
        const customers: CustomerMinimal[] = Array.isArray(res.data) ? res.data : [];
        const active = customers.filter(c => c.customerStatus === 'ACTIVE').length;
        const inactive = customers.filter(c => c.customerStatus === 'INACTIVE').length;

        this.summaryCards[1].value = customers.length;
        this.summaryCards[2].value = active;
        this.summaryCards[3].value = inactive;

        this.createCustomerChart(customers);
        this.createCustomersMonthlyChart(customers);
      }
    });

    const req = { status: "ACTIVE" };
    this.userService.getAllUsers(req).subscribe({
      next: (res) => {
        const employees = res.data;
        this.summaryCards[0].value = employees.length;
        this.createEmployeeChart(employees);
        this.createEmployeeStatusChart(employees);
      }
    });
  }

  private createCustomerChart(customers: any[]) {
    const ctx = document.getElementById('customersChart') as HTMLCanvasElement;
    const counts = {
      ACTIVE: customers.filter(c => c.customerStatus === 'ACTIVE').length,
      POTENTIAL: customers.filter(c => c.customerStatus === 'POTENTIAL').length,
      INACTIVE: customers.filter(c => c.customerStatus === 'INACTIVE').length,
    };

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Activos', 'Potenciales', 'Inactivos'],
        datasets: [{
          data: [counts.ACTIVE, counts.POTENTIAL, counts.INACTIVE],
          backgroundColor: ['#198754', '#0dcaf0', '#dc3545']
        }]
      },
      options: { plugins: { legend: { position: 'bottom' } } }
    });
  }

  private createEmployeeChart(employees: any[]) {
    const ctx = document.getElementById('employeesChart') as HTMLCanvasElement;
    const roles = employees.flatMap(e => e.roles || []);
    const counts: Record<string, number> = {};
    roles.forEach(r => counts[r] = (counts[r] || 0) + 1);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(counts),
        datasets: [{
          label: 'Cantidad',
          data: Object.values(counts),
          backgroundColor: '#354f7d'
        }]
      },
      options: {
        scales: { y: { beginAtZero: true } },
        plugins: { legend: { display: false } }
      }
    });
  }

  private createCustomersMonthlyChart(customers: any[]) {
    const ctx = document.getElementById('customersMonthlyChart') as HTMLCanvasElement;

    // Simulación de clientes por mes
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    const data = months.map(() => Math.floor(Math.random() * 20) + 5);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Clientes nuevos',
          data,
          borderColor: '#354f7d',
          backgroundColor: 'rgba(53, 79, 125, 0.2)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        plugins: { legend: { position: 'bottom' } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  private createEmployeeStatusChart(employees: any[]) {
    const ctx = document.getElementById('employeeStatusChart') as HTMLCanvasElement;

    const active = employees.filter(e => e.status === 'ACTIVE').length;
    const inactive = employees.filter(e => e.status === 'INACTIVE').length;

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Activos', 'Inactivos'],
        datasets: [{
          data: [active, inactive],
          backgroundColor: ['#198754', '#dc3545']
        }]
      },
      options: {
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }
}
