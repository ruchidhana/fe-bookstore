import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../../models/user.model';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  returnUrl: string;
  token_id: string;
  hasMessage: boolean;

  result: any;
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private http: HttpClient
  ) {

  }
  ngOnInit(): void {
    this.initForm();
    // this.hasMessage = false;
    // get return url from route parameters or default to '/'

    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
    this.hasMessage = localStorage.getItem('reset_message') == 'true' ? true : false;

    // activate user account
    this.route.queryParams.subscribe(params => {
      this.token_id = params['token_id'];

    });

  }

  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),//change this to 8
          Validators.maxLength(8),
        ]),
      ],
    });
  }

  submit() {
    localStorage.setItem('reset_message', 'false');
    this.hasMessage = false;

    const loginSubscr = this.authService
      .login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe((user: UserModel | undefined) => {

        const currentUser = this.authService.currentUserValue;
        let email = currentUser?.email!;
        localStorage.setItem("email",email);

        if (user) {
          const auth = this.authService.getAuthFromLocalStorage();
          console.log(auth);

          if (currentUser?.role_name =="Author") {
            this.router.navigate(['author-dashboard']);
          }
          else if(currentUser?.role_name=="Admin")
          {
            this.router.navigate(['admin-dashboard']);
          }

        } else {
          console.log("erro");

          const lsValue = localStorage.getItem('login');
          console.log(lsValue);

          if (!lsValue) {
            return undefined;
          }

          const authData = JSON.parse(lsValue);
          //console.log(authData);

          if (authData.error == true) {
            this.toastr.error(authData.message);
          }
        }
      });
    this.unsubscribe.push(loginSubscr);
    // this.hasActivatedSuccessStatus = false;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


}
