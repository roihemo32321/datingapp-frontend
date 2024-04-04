import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../models/user';
import { BehaviorSubject, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]); // This will store the list of online users.
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor() {}

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token, // This is how we send the token to the server.
      })
      .withAutomaticReconnect() // This will automatically reconnect the client to the server if the connection is lost.
      .build();

    this.hubConnection.start().catch((error) => console.log(error));

    this.hubConnection.on('UserIsOnline', (username) => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: (usernames) => {
          this.onlineUsersSource.next([...usernames, username]);
        },
      });

      console.log(username + ' is online');
    });

    this.hubConnection.on('UserIsOffline', (username) => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: (usernames) => {
          this.onlineUsersSource.next([
            ...usernames.filter((x) => x !== username),
          ]);
        },
      });

      console.log(username + ' is offline');
    });

    this.hubConnection.on('GetOnlineUsers', (usernames: string[]) => {
      this.onlineUsersSource.next(usernames);
    });

    this.hubConnection.on('NewMessageReceived', ({ username, knownAs }) => {
      console.log('username: ' + username + ' knownAs: ' + knownAs);
    });
  }

  stopHubConnection() {
    this.hubConnection?.stop().catch((error) => console.log(error));
  }
}
