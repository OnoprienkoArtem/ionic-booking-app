import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from './user.model';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    localId: string;
    expiresIn: string;
    registered?: boolean;
}
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // tslint:disable-next-line: variable-name
    // private _userIsAuthenticated = false;
    // tslint:disable-next-line: variable-name
    private _user = new BehaviorSubject<User>(null);
    // tslint:disable-next-line: variable-name
    // private _token = new BehaviorSubject<string>();

    get userIsAuthenticated() {
        return this._user.asObservable().pipe(
            map(user => {
                if (user) {
                    return !!user.token;
                } else {
                    return false;
                }
            })
        );
    }

    get userId() {
        return this._user.asObservable().pipe(
            map(user => {
                if (user) {
                    return user.id;
                } else {
                    return null;
                }
            })
        );
    }

    constructor(private http: HttpClient) {}

    signup(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
                { email, password, returnSecureToken: true }
            )
            .pipe(tap(this.setUserData.bind(this)));
    }

    login(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
                { email, password }
            )
            .pipe(tap(this.setUserData.bind(this)));
    }

    logout() {
        this._user.next(null);
    }

    private setUserData(userData: AuthResponseData) {
        const expirationTime = new Date(
            new Date().getTime() + +userData.expiresIn * 1000
        );
        this._user.next(
            new User(
                userData.localId,
                userData.email,
                userData.idToken,
                expirationTime
            )
        );
    }
}
