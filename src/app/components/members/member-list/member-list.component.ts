import { Component, OnInit } from '@angular/core';
import { Member } from '../../../models/member';
import { MembersService } from '../../../services/members.service';
import { Pagination } from '../../../models/pagination';
import { PageEvent } from '@angular/material/paginator';
import { UserParams } from '../../../models/userParams';
import { User } from '../../../models/user';
import { AccountService } from '../../../services/account.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss',
})
export class MemberListComponent implements OnInit {
  members: Member[] | undefined;
  pagination: Pagination | undefined;
  userParams: UserParams | undefined;
  user: User | undefined;
  genderList = [
    { value: 'male', viewValue: 'Males' },
    { value: 'female', viewValue: 'Females' },
  ];

  constructor(
    private memberService: MembersService,
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

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    console.log('Check');

    if (!this.userParams) return;
    console.log('Check');

    // Load members for current page
    this.memberService.getMembers(this.userParams).subscribe({
      next: (res) => {
        this.members = res?.result;
        this.pagination = res?.pagination;
        console.log(res);
      },
    });
  }

  resetFilters() {
    if (this.user) {
      this.userParams = new UserParams(this.user); // resets our userParams to the default.
      this.loadMembers();
    }
  }

  changePage($event: PageEvent) {
    if (this.userParams) {
      this.userParams.pageNumber = $event.pageIndex + 1;
      this.userParams.pageSize = $event.pageSize;
      this.loadMembers();
    }
  }
}
