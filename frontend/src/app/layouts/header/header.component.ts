import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private _userService: UserService,
    private router: Router,
    private toastr: ToastrService) {

  }
  isLoggedInn: boolean = false;
  isAdmin:boolean=this._userService.isAdmin();

  // ngOnInit(): void {
  //   this.checkAdmin
  // }
  // checkAdmin(){
  //   this.isAdmin==this._userService.isAdmin()
  // }
  defaultProfile: string =
    'https://www.kindpng.com/picc/m/252-2524695_dummy-profile-image-jpg-hd-png-download.png'

  logout() {
    this._userService.logout()
    this.isLoggedInn = false
    this.toastr.info(`See you next time!!`, `Logged Out!`, {
      timeOut: 3000,
      closeButton: true,
      progressBar: true
    })
    this.router.navigate(['/login'])
  }
}
