import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // tslint:disable-next-line: variable-name
    private _userIsAuthenticated = true;
    // tslint:disable-next-line: variable-name
    private _userId = 'abc';

    get userIsAuthenticated() {
        return this._userIsAuthenticated;
    }

    get userId() {
        return this._userId;
    }

    constructor(private http: HttpClient) {}

    signup(email: string, password: string) {
        return this.http.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
            { email, password, returnSecureToken: true }
        );
    }

    login() {
        this._userIsAuthenticated = true;
    }

    logout() {
        this._userIsAuthenticated = false;
    }
}
