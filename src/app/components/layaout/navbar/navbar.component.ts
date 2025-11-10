import {Component, inject} from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";
import {Router} from "@angular/router";
import {LayoutService} from "../../../services/layout.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);
  layoutService = inject(LayoutService);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']).then();
  }

  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }
}
