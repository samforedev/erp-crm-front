import {Component, inject} from '@angular/core';
import {LayoutService} from "../../../services/layout.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  private sidebarOpen = new BehaviorSubject<boolean>(true);

  isSidebarOpen$ = this.sidebarOpen.asObservable();

  toggleSidebar() {
    this.sidebarOpen.next(!this.sidebarOpen.value);
  }

}
