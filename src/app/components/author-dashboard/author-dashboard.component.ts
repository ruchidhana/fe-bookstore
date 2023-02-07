import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService, UserType } from '../../index';
import { LocationStrategy } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'app-author-dashboard',
  templateUrl: './author-dashboard.component.html',
  styleUrls: ['./author-dashboard.component.css']
})
export class AuthorDashboardComponent {
  isLoading$: Observable<boolean>;
  result: any;
  user$: Observable<UserType>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private location: LocationStrategy
  ) {
    this.isLoading$ = this.authService.isLoading$;

    // push current state again to prevent further attempts.
    history.pushState(null, '', window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, '', window.location.href);
    });
  }

  ngOnInit(): void {
    // this.filename = 'No any uploaded Slip';

    this.authService.view_uploaded_books().subscribe((data: any) => {
      this.result =data["result"];
    });

  }
}
