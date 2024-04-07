import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, map } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;

  private currentUserSource = new BehaviorSubject<User | null>(null); // A behavior subject that we can subscribe to our changes.
  currentUser$ = this.currentUserSource.asObservable(); // Observable for the current user.

  private logoutSubject = new Subject<void>();
  public logout$ = this.logoutSubject.asObservable(); // Using it to reset the user params in the members service.

  constructor(
    private http: HttpClient,
    private presenceService: PresenceService
  ) {}

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((user: User) => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  setCurrentUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? (user.roles = roles) : user.roles.push(roles);

    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user); // Setting the user to the local storage value.
    this.presenceService.createHubConnection(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);

    // Emit an event indicating that a logout has occurred
    this.logoutSubject.next();
    this.presenceService.stopHubConnection();
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
