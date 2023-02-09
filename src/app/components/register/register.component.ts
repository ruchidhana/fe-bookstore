import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { Subscription, Observable } from 'rxjs';
import { Config } from '../../models/config.model';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  hasError: boolean;
  hasSuccess: boolean;
  contractTypeValid : boolean = false;
  isLoading$: Observable<boolean>;
  branches: [];
  AdmissionNoPrefixValidationLabel : boolean = true;
  showMyContainer: boolean = true;
  branch: any[] = [ ];
  message : string ="";
  private unsubscribe: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {

  }

  ngOnInit(): void {
    this.initForm();
    // this.hasMessage = false;
    // get return url from route parameters or default to '/'

  }

  get f() {
    return this.registerForm.controls;
  }

  initForm() {
    this.registerForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ],
      first_name: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ],
      last_name: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ],
      no_of_published_books: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8)
        ]),
      ],
    });
  }

  submit() {
    this.hasError = false;
    const result: {
      [key: string]: string;
    } = {};
    Object.keys(this.f).forEach((key) => {
      result[key] = this.f[key].value;
    });
    const newUser = new UserModel();
    newUser.setUser(result);

    const registrationSubscr = this.authService
      .registration(newUser)
      .pipe(first())
      .subscribe((result: Config) => {
        if (result.error==false) {
          this.hasSuccess = true;
          this.message = result.message;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'User Created Successfully!',
            text: 'Please wait 1 hours to activate your account',
          })
          this.router.navigate(['/login']);
        } else {
          this.hasError = true;
          this.message = result.message;
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'User Created Unsuccessfully!',
            text: this.message,
          })
        }
      });
    this.unsubscribe.push(registrationSubscr);
  }
}
