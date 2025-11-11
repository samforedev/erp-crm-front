import {Component, inject, OnInit} from '@angular/core';
import {UserService} from "../../../../services/insurance/user.service";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {UserDetail} from "../../../../models/insurance/userModel";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  loading = true;
  error?: string;
  user?: UserDetail;

  ngOnInit(): void {
    this.initialUserData();
  }

  goBack() {
    this.location.back();
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
        },
        error: (err) => {
          this.error = 'No se pudo cargar el cliente';
          this.loading = false;
        }
      });
    }
  }

}
