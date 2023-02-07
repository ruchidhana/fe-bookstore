export class AuthModel {
  authToken: string;
  refreshToken: string;
  message : string;
  error : boolean;

  // expiresIn: Date;

  setAuth(auth: AuthModel) {
    this.authToken = auth.authToken;
    this.refreshToken = auth.refreshToken;
    // this.expiresIn = auth.expiresIn;
  }
}
