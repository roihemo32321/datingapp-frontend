import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Member } from '../models/member';
import { map, of } from 'rxjs';
import { PaginationResult } from '../models/pagination';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = []; // Saving members in our service will improve our angular app because of services stays alive every time!

  // Add a map to cache page data
  private memberCache = new Map<string, PaginationResult<Member[]>>();

  constructor(private http: HttpClient) {}

  getMembers(page?: number, itemsPerPage?: number) {
    // Generate a cache key based on page and size
    const cacheKey = `${page}-${itemsPerPage}`;

    // Check if data is already cached
    if (this.memberCache.has(cacheKey)) {
      return of(this.memberCache.get(cacheKey));
    }

    let params = new HttpParams()
      .set('pageNumber', page!.toString())
      .set('pageSize', itemsPerPage!.toString());

    // If not cached, fetch data from server
    return this.http
      .get<Member[]>(`${this.baseUrl}users`, { observe: 'response', params })
      .pipe(
        map((res) => {
          const paginatedResult = new PaginationResult<Member[]>();

          // Save response to cache
          if (res.body) {
            paginatedResult.result = res.body;
          }

          const pagination = res.headers.get('Pagination');

          if (pagination) {
            paginatedResult.pagination = JSON.parse(pagination);
          }

          this.memberCache.set(cacheKey, paginatedResult);
          return paginatedResult;
        })
      );
  }

  getMember(username: string) {
    const member = this.members.find((x) => x.userName === username); // Trying to find if we have the user in our members list to prevent a request.

    if (member) {
      return of(member);
    }

    return this.http.get<Member>(`${this.baseUrl}users/${username}`);
  }

  /**
   * Updating our member in the database while also updating in our member list.
   * @param member
   * @returns
   */

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = { ...this.members[index], ...member };
      })
    );
  }
}
