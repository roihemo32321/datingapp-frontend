import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../models/member';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = []; // Saving members in our service will improve our angular app because of services stays alive every time!

  constructor(private http: HttpClient) {}

  getMembers() {
    if (this.members.length > 0) return of(this.members); // If we have members we return of(observable) of the members.

    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      map((members) => {
        this.members = members;
        return members;
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
