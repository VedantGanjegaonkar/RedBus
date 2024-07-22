import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private router: Router) { }

  navigateToCreateBus() {
    this.router.navigateByUrl('/pages/admin/create-bus');
  }

  navigateToCreateRoute() {   
    this.router.navigate(['pages/admin/create-route']);
  }
}

