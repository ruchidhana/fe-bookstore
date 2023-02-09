import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../index';
import { LocationStrategy } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { BookModel } from 'src/app/models/book.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-landpage',
  templateUrl: './landpage.component.html',
  styleUrls: ['./landpage.component.css']
})
export class LandpageComponent implements OnInit {
  isLoading$: Observable<boolean>;
  result: BookModel[] = [];
  selectedType = '';
  title:any;
  author:any;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
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


	onSelected(value:string): void {
		this.selectedType = value;
	}

  search() {
    if (this.selectedType=="") {
      this.toastr.error("Please select a type");
    }
    else if (this.title=="" || this.author=='') {
      this.ngOnInit();
    }
    else if(this.title!=""){
      this.result =this.result.filter(res => {
      return res.title.toLocaleLowerCase().match(this.title.toLocaleLowerCase());
      })
    }
    else if(this.author!=""){
      this.result =this.result.filter(res => {
      return res.author.toLocaleLowerCase().match(this.author.toLocaleLowerCase());
      })
    }
  }
}
