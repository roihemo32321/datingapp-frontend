import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  generatePaginationParams,
  getPaginatedResult,
} from './paginationHelper';
import { Message } from '../models/message';
import { PaginationResult } from '../models/pagination';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  baseUrl = environment.apiUrl;
  private cachedData = new Map<string, PaginationResult<Message[]>>();
  constructor(private http: HttpClient) {}

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

  sendMessage(username: string, content: string) {
    return this.http.post<Message>(this.baseUrl + 'messages', {
      recipientUsername: username,
      content,
    });
  }
}
