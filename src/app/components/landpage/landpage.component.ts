import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../index';
import { LocationStrategy } from '@angular/common';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-landpage',
  templateUrl: './landpage.component.html',
  styleUrls: ['./landpage.component.css']
})
export class LandpageComponent implements OnInit {
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

  ngOnInit(): void {
    // this.filename = 'No any uploaded Slip';
    this.authService.get_all_books().subscribe((data: any) => {
      this.result =data["book_name"];
    });

  }
}
