import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { AuthStateService } from '../../services/auth-state.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isSignedIn!: boolean;
  email:any=true;
  isadmin:boolean=false;
  isauthor:boolean=false;
  isMenuVisible:boolean=false;

  constructor(
    private auth: AuthStateService,
    public router: Router,
    public token: TokenService
  ) {

    // if(role=='Admin'){
    //   this.isadmin=true;
    // }
    // if(role=='Author'){
    //   this.isadmin=true;
    // }


  }

  ngOnInit() {

    this.auth.userAuthState.subscribe((val) => {
      this.isSignedIn = val;
    });
    this.email = localStorage.getItem("email")!=null?true:false;
  }

  // Signout
  signOut() {
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("v8.0.29-authf649fc9a5f55");
    this.router.navigate(['/login']);
    this.email = localStorage.getItem("email")!=null?true:false;

  }

  ngDoCheck(): void {

    let currentroute = this.router.url;

    let role=localStorage.getItem('role');

    if (currentroute == '/login' || currentroute == '/register') {
      this.isMenuVisible = false
    }
    else if(currentroute == '/' && localStorage.getItem('email')!=null)
    {
      this.isMenuVisible = true
    }
    else if(currentroute == '/' && localStorage.getItem('email')==null)
    {
      this.isMenuVisible = false
    }
    else {
      this.isMenuVisible = true
    }

    if (role == 'Admin') {
      this.isadmin = true;
    }else{
      this.isadmin = false;
    }
    if (role == 'Author') {
      this.isauthor = true;
    }else{
      this.isauthor = false;
    }

  }
}
