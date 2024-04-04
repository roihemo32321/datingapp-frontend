import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  generatePaginationParams,
  getPaginatedResult,
} from './paginationHelper';
import { Message } from '../models/message';
import { PaginationResult } from '../models/pagination';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../models/user';
import { BehaviorSubject, take } from 'rxjs';
import { Group } from '../models/group';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;

  private hubConnection?: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  private cachedData = new Map<string, PaginationResult<Message[]>>();

  constructor(private http: HttpClient) {}

  createHubConnection(user: User, otherUser: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUser, {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => console.log(error));
    this.hubConnection.on('ReceiveMessageThread', (messages) => {
      this.messageThreadSource.next(messages);
    });

    this.hubConnection.on('NewMessage', (message) => {
      this.messageThreadSource.next([
        ...this.messageThreadSource.value,
        message,
      ]);
    });

    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some((x) => x.username === otherUser)) {
        this.messageThread$.pipe(take(1)).subscribe({
          next: (messages) => {
            messages.forEach((message) => {
              if (!message.dateRead) {
                message.dateRead = new Date(Date.now());
              }
            });
            this.messageThreadSource.next([...messages]);
          },
        });
      }
    });
  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = generatePaginationParams(pageNumber, pageSize);
    params = params.append('container', container);
    const cacheKey = `${pageNumber}-${pageSize}-${container}`;

    return getPaginatedResult<Message[]>(
      this.baseUrl + 'messages',
      params,
      this.http,
      this.cachedData,
      cacheKey
    );
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(
      this.baseUrl + 'messages/thread/' + username
    );
  }

  async sendMessage(username: string, content: string) {
    return this.hubConnection
      ?.invoke('SendMessage', {
        recipientUsername: username,
        content,
      })
      .catch((error) => console.log(error));
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }
}
