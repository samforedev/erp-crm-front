import {Component, inject} from '@angular/core';
import {LayoutService} from "../../../services/layout.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  layoutService = inject(LayoutService);

  isSidebarOpen$ = this.layoutService.isSidebarOpen$;

}
