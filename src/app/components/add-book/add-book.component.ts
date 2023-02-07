import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../index';
import { BookModel } from '../../models/book.model';


import { Router,ActivatedRoute  } from '@angular/router';


@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent {
  bookAddForm: FormGroup;
  hasError: boolean;
  hasSuccess: boolean;
  contractTypeValid: boolean = false;
  isLoading$: Observable<boolean>;
  result: any;
  subjects: any;
  filename: string;
  data: any;
  myFormData: String;
  filedata: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
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
    this.initForm();
    // this.hasMessage = false;
    // get return url from route parameters or default to '/'

  }

  fileChange(file: any) {
    this.filedata = file.target.files[0];
    const file_name = file.target.files[0];

    if (this.filedata == '') {
      this.filename = 'No any uploaded Slip';
    }
    else {
      console.log("awa");

      this.bookAddForm.patchValue({
        fileSource: file_name
      });
      this.filename = this.filedata.name;
    }
  }

  get f() {
    return this.bookAddForm.controls;
  }

  initForm() {
    this.bookAddForm = this.fb.group({
      title: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ],
      description: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ],
      fileSource: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ],
      isbn: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ],
      file_input: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ],
      price: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1)
        ]),
      ],
    });
  }

  submit() {
    // const result: {
    //   [key: string]: string;
    // } = {};
    let email=localStorage.getItem("email");
    console.log("emmail is",email);

    const u_id = this.authService.currentUserValue?.u_id;
    var title = this.f.title.value;
    var price = this.f.price.value;
    var isbn = this.f.isbn.value;
    var description = this.f.description.value;
    // Object.keys(this.f).forEach((key) => {
    //   result[key] = this.f[key].value;
    // });

    // const book = new BookModel();
    // book.setBook(result);
    // console.log(book);
    var myFormData = new FormData();
    myFormData.append('image', this.bookAddForm.get('fileSource')!.value);
    myFormData.append('price', price + "");
    myFormData.append('isbn', isbn + "");
    myFormData.append('description', description + "");
    myFormData.append('title', title + "");
    myFormData.append('email', email + "");
    //var formData: any = new FormData();
    // formData.append('isbn', this.bookAddForm.get('isbn')?.value);
    // formData.append('price', this.bookAddForm.get('price')?.value);
    // formData.append('description', this.bookAddForm.get('description')?.value);
    // formData.append('title', this.bookAddForm.get('title')?.value);
    // formData.append('cover_image', this.bookAddForm.get('file_input')?.value);
    this.authService.slipPath(myFormData).subscribe(res => {
      if (res.error == true) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: res.message,
        })
        this.router.navigate(['/author-dashboard']);
      } else {
        Swal.fire({
          title: 'Success',
          text: res.message,
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {
          this.router.navigate(['/author-dashboard']);
        });
      }
    });
  }
}
