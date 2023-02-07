import { AuthModel } from './auth.model';

export class UserModel extends AuthModel {
  u_id: number;
  password: string;
  fullname: string;
  email: string;
  pic: string;
  first_name: string;
  last_name: string;
  no_of_published_books:number;
  role_name:string;


  setUser(_user: unknown) {
    const user = _user as UserModel;
    this.no_of_published_books = user.no_of_published_books;
    this.password = user.password || '';
    // this.confirm_password = user.confirm_password || '';
    this.first_name = user.first_name || '';
    this.last_name = user.last_name || '';
    this.email = user.email || '';
    // this.pic = user.pic || './assets/media/users/default.jpg'
  }
}
