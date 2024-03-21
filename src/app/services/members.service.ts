import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Member } from '../models/member';
import { map, of } from 'rxjs';
import { PaginationResult } from '../models/pagination';
import { UserParams } from '../models/userParams';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = []; // Saving members in our service will improve our angular app because of services stays alive every time!

  // Add a map to cache page data
  private cachedData = new Map<string, PaginationResult<any>>();
  private memberCache = new Map<string, Member>();

  constructor(private http: HttpClient) {}

  getMembers(userParams: UserParams) {
    let params = this.generatePaginationParams(
      userParams.pageNumber,
      userParams.pageSize
    );

    params = params.append('gender', userParams.gender);
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('orderBy', userParams.orderBy);

    const cacheKey = Object.values(userParams).join('-');

    return this.getPaginatedResult<Member[]>(
      `${this.baseUrl}users`,
      params,
      cacheKey
    );
  }

  private getPaginatedResult<T>(
    url: string,
    params: HttpParams,
    cacheKey: string
  ) {
    // Check if data is already cached
    if (this.cachedData.has(cacheKey)) {
      console.log('Using cached data');
      return of(this.cachedData.get(cacheKey));
    }

    // If not cached, fetch data from server
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map((res) => {
        const paginatedResult = new PaginationResult<T>();

        // Save response to cache
        if (res.body) {
          paginatedResult.result = res.body;
        }

        const pagination = res.headers.get('Pagination');

        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination);
        }

        this.cachedData.set(cacheKey, paginatedResult);
        return paginatedResult;
      })
    );
  }

  private generatePaginationParams(pageNumber: number, pageSize: number) {
    return new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
  }

  getMember(username: string) {
    // Check if we have the member cached using the username as the key
    const member = this.memberCache.get(username) as Member;
    if (member) {
      console.log('Using cached member');
      return of(member); // Return the cached member as an observable
    }

    // If not cached, fetch the member from the server and cache it
    return this.http.get<Member>(`${this.baseUrl}users/${username}`).pipe(
      map((member) => {
        this.memberCache.set(username, member); // Cache the fetched member
        return member;
      })
    );
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
