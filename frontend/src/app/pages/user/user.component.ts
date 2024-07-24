import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  searchParams: any = {
    from: '',
    to: '',
    date: ''
  };

  constructor(private router: Router) { }

  onSearch(): void {
    const queryParams = { ...this.searchParams };
    // if (queryParams.date) {
    //   queryParams.date = new Date(queryParams.date).toISOString();
    // }
    console.log("queryParams",queryParams);
    
    this.router.navigate(['/pages/user/buses'], { queryParams });
  }
}
