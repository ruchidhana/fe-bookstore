import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { AuthHTTPService } from './auth-http/auth-http.service';
import { Config } from '../models/config.model';

import { environment } from '../environments/environment';
import { BookModel } from '../models/book.model';


export type UserType = UserModel | undefined;
export type UserAuth = AuthModel | undefined;
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private issuer = {
    login: 'http://127.0.0.1:8000/api/login',
    register: 'http://127.0.0.1:8000/api/register',
  };
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  constructor(private authHttpService: AuthHTTPService,) {
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
  }
  currentUser$: Observable<UserType>;
  currentAuth$: Observable<UserAuth>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  currentAuthSubject: BehaviorSubject<UserAuth>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  login(email: string, password: string): Observable<UserType> {



    return this.authHttpService.login(email, password).pipe(
      map((auth: AuthModel) => {
        console.log(auth);
        const result = this.setAuthFromLocalStorage(auth);


        return result;
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        return of(undefined);
      }),

    );
  }
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.authToken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    } else if (auth.error == true) {
      localStorage.setItem('login', JSON.stringify(auth));
    }
    return false;
  }

  view_uploaded_books(): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }
    return this.authHttpService
      .view_uploaded_books(auth.authToken)
      .pipe();
  }


  slipPath(data: any): Observable<any> {
    // this.isLoadingSubject.next(true);
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }
    return this.authHttpService
      .slipPath(data, auth.authToken)
      .pipe();
  }


  get_all_users(): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }
    return this.authHttpService
      .get_all_users(auth.authToken)
      .pipe();
  }

  switch_active_status(id:number,is_active:number): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }
    return this.authHttpService
      .switch_active_status(id,is_active,auth.authToken)
      .pipe();
  }

  isLoggedIn() {
    return this.isValidToken();
  }

  // Verify the token
  isValidToken() {
    const token = this.getToken();

    if (token) {
      const payload = this.payload(token);
      if (payload) {
        return Object.values(this.issuer).indexOf(payload.iss) > -1
          ? true
          : false;
      }
    } else {
      return false;
    }
  }


  payload(token: any) {
    const jwtPayload = token.split('.')[1];
    return JSON.parse(atob(jwtPayload));
  }

  getToken() {
    return localStorage.getItem(this.authLocalStorageToken);
  }

  // need create new user then login
  registration(user: UserModel): Observable<Config> {
    //this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      //finalize(() => this.isLoadingSubject.next(false))
    );
  }

  get_all_books(): Observable<any> {

    return this.authHttpService
      .get_all_books()
      .pipe();
  }


  public getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      return undefined;
    }
  }


  getUserByToken(): Observable<UserType> {
    const auth = this.getAuthFromLocalStorage();

    if (!auth || !auth.authToken) {
      return of(undefined);
    }



    return this.authHttpService.getUserByToken(auth.authToken).pipe(
      map((user: UserType) => {
        if (user) {
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
        return user;
      }),

    );
  }

  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
    window.location.href = location.origin + '/auth/login';

    // this.router.navigate(['/auth/login'], {
    //   queryParams: {},
    // });
  }
}
