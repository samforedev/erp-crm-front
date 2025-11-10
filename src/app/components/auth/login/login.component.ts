import {Component, inject} from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {LoginRequest} from "../../../models/auth/authModels";
import {ApiErrorResponse} from "../../../models/apiResponse";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loginError: string | null = null;
  isLoading: boolean = false;

  loginForm = this.fb.group({
    usernameOrEmail: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    this.isLoading = true;
    this.loginError = null;

    const { usernameOrEmail, password } = this.loginForm.value;
    const loginRequest: LoginRequest = {
      usernameOrEmail: usernameOrEmail as string,
      password: password as string
    }

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        this.authService.setToken(response.data.accessToken);
        this.router.navigate(['/home']).then();
      },
      error: (error: ApiErrorResponse<any>) => {
        this.loginError = error.errorMessage;
        this.loginForm.reset();
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });

  }

}
