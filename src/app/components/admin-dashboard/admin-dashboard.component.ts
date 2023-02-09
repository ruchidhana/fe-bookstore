import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../index';
import { LocationStrategy } from '@angular/common';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  isLoading$: Observable<boolean>;
  result: any;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService, private location: LocationStrategy
  ) {
    this.isLoading$ = this.authService.isLoading$;

    // push current state again to prevent further attempts.
    history.pushState(null, '', window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, '', window.location.href);
    });
  }

  toggle(event:any,i: any) {
    event.preventDefault();
    this.abc(i.id,i.is_active);

  }

  abc(id:any,is_active:any)
  {
    this.authService.switch_active_status(id,is_active).subscribe((data: any) => {
      this.ngOnInit();
    });
  }
  ngOnInit(): void {
    // this.filename = 'No any uploaded Slip';
    this.authService.get_all_users().subscribe((data: any) => {
      console.log(data);

      this.result =data["result"];
    });

  }
}
