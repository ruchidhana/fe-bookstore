import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private service: AuthService,
    private router: Router,
    private tostr: ToastrService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    if (this.service.isLoggedIn()) {
      if (route.url.length > 0) {
        let menu = route.url[0].path;
        if (menu == 'admin-dashboard')
        {
          if (this.service.getRole() == 'Admin') {
            return true;
          }
          else if (this.service.getRole() == 'Author') {
            this.router.navigate(['author-dashboard']);
            this.tostr.warning('You dont have access.');
            return false;
          }
          else {
            this.router.navigate(['']);
            this.tostr.warning('You dont have access.');
            return false;
          }
        }
          else if (menu == 'author-dashboard')
          {
            if (this.service.getRole() == 'Author')
            {
              return true;
            }
            else if (this.service.getRole() == 'Admin') {
              this.router.navigate(['admin-dashboard']);
              return false;
            }
            else {
              this.router.navigate(['']);
              this.tostr.warning('You dont have access.');
              return false;
            }
        }
        else if (menu == 'add_book')
          {
            if (this.service.getRole() == 'Author')
            {
              return true;
            }
            else if (this.service.getRole() == 'Admin') {
              this.router.navigate(['author-dashboard']);
              return false;
            }
            else {
              this.router.navigate(['']);
              this.tostr.warning('You dont have access.');
              return false;
            }
        }
        else
        {
          this.router.navigate(['']);
          this.tostr.warning('You dont have access.');
          return false;
        }
      }
      else
      {
        return true;
      }
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
