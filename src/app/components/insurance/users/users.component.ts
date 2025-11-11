import {Component, inject, OnInit} from '@angular/core';
import {UserService} from "../../../services/insurance/user.service";
import {UserMinimal} from "../../../models/insurance/userModel";
import {ApiSuccessResponse} from "../../../models/apiResponse";
import {Router} from "@angular/router";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  private userService = inject(UserService);
  private router = inject(Router);

  users: UserMinimal[] = [];

  private isLoading: boolean = false;

  ngOnInit(): void {
    this.loadUsers();
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
