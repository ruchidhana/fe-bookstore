import { Injectable, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../models/user.model';
import { environment } from '../../environments/environment';
import { AuthModel } from '../../models/auth.model';
import { Config } from '../../models/config.model';
import { BookModel } from 'src/app/models/book.model';

// import { Config } from '../../components/reset-password/reset-password.component';
// import { ICreateAccount } from 'src/app/modules/wizards/create-account.helper';

const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {

  // @Input() defaultValues: Partial<ICreateAccount>;

  constructor(private http: HttpClient) { }

  // public methods
  login(email: string, password: string): Observable<any> {
    console.log(this.http.post<AuthModel>(`${API_USERS_URL}/login`, {
      email,
      password,
    }));

    return this.http.post<AuthModel>(`${API_USERS_URL}/login`, {
      email,
      password,
    });
  }


  createUser(user: UserModel): Observable<Config> {
    return this.http.post<Config>(`${API_USERS_URL}/register`, user);
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(user_name: string): Observable<any> {
    return this.http.post<any>(`${API_USERS_URL}/forgot-password`, {
      user_name,
    });
  }

  slipPath(data: any, token: string): Observable<any> {

    const headers = new HttpHeaders();
    // headers.append('Authorization',`Bearer ${token}`);
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.post<any>(`${API_USERS_URL}/add_book`, data, {
      headers: headers
  });
  }


  /**
   * Get Student Details for view in Edit Student Privilieges form datatable
   */
  get_all_books(): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/get_all_books`, {
    });
  }

  /**
   * Get uploaded_books corresponding to user
   */
  view_uploaded_books(token: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      "Accept": "application/json",
    });
    return this.http.get<any>(`${API_USERS_URL}/view_uploaded_books`, { headers: httpHeaders });
  }

  get_all_users(token: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      "Accept": "application/json",
    });
    return this.http.get<any>(`${API_USERS_URL}/get_all_users`, { headers: httpHeaders });
  }

  switch_active_status(id:number,is_active:number,token: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      "Accept": "application/json",
    });
    return this.http.put<any>(`${API_USERS_URL}/switch_active_status`, {id:id,is_active:is_active,token:token} ,{ headers: httpHeaders });
  }

   /**
   * Send Student Record for Edit
   */
    get_edit_student_record(data:any,token: string): Observable<any> {
      const httpHeaders = new HttpHeaders();
      httpHeaders.append('Content-Type', 'multipart/form-data');
      httpHeaders.append('Accept', 'application/json');
      return this.http.post<any>(`${API_USERS_URL}/loadStudentRecordForEdit`, data, {
        headers: httpHeaders
      });
    }

  getUserByToken(token: string): Observable<UserModel> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      "Accept": "application/json"
    });
    return this.http.get<UserModel>(`${API_USERS_URL}/getProfile`, {
      headers: httpHeaders,
    });
  }
}
