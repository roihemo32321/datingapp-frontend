import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Member } from '../models/member';
import { map, of, take } from 'rxjs';
import { PaginationResult } from '../models/pagination';
import { UserParams } from '../models/userParams';
import { AccountService } from './account.service';
import { User } from '../models/user';
import {
  getPaginatedResult,
  generatePaginationParams,
} from './paginationHelper';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  user: User | undefined;
  userParams: UserParams | undefined;

  // Add a map to cache page data
  private cachedData = new Map<string, PaginationResult<Member[]>>();
  private memberCache = new Map<string, Member>();

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
          this.userParams = new UserParams(user);
        }
      },
    });
  }

  getMembers(userParams: UserParams) {
    let params = generatePaginationParams(
      userParams.pageNumber,
      userParams.pageSize
    );

    params = params.append('gender', userParams.gender);
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('orderBy', userParams.orderBy);

    const cacheKey = Object.values(userParams).join('-');

    return getPaginatedResult<Member[]>(
      `${this.baseUrl}users`,
      params,
      this.http,
      this.cachedData,
      cacheKey
    );
  }

  getMember(username: string) {
    const member = this.memberCache.get(username);

    if (member) {
      console.log('Using cached member');
      return of(member);
    }

    // If the member is not found in the cache, fetch from the server
    return this.http.get<Member>(`${this.baseUrl}users/${username}`).pipe(
      map((member) => {
        this.memberCache.set(username, member);
        return member;
      })
    );
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(userParams: UserParams) {
    this.userParams = userParams;
  }

  addLike(username: string) {
    return this.http.post(`${this.baseUrl}likes/${username}`, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = generatePaginationParams(pageNumber, pageSize);
    params = params.append('predicate', predicate);

    const cacheKey = `${predicate}-${pageNumber}-${pageSize}`;

    return getPaginatedResult<Member[]>(
      `${this.baseUrl}likes`,
      params,
      this.http,
      this.cachedData,
      cacheKey
    );
  }

  resetUserParams() {
    if (this.user) {
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
    return;
  }

  /**
   * Updating our member in the database while also updating in our member list.
   * @param member
   * @returns
   */

  updateMember(member: Member, username: string) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const updateMember = {
          ...this.memberCache.get(username),
          ...member,
        };

        this.memberCache.set(username, updateMember);
      })
    );
  }
}
