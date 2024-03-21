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
  genderList = [
    { value: 'male', viewValue: 'Males' },
    { value: 'female', viewValue: 'Females' },
  ];

  constructor(private memberService: MembersService) {
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    if (this.userParams) {
      this.memberService.setUserParams(this.userParams);
      // Load members for current page
      this.memberService.getMembers(this.userParams).subscribe({
        next: (res) => {
          this.members = res?.result;
          this.pagination = res?.pagination;
        },
      });
    }
  }

  setOrderByMembers(orderBy: string) {
    if (this.userParams) {
      this.userParams.orderBy = orderBy;
      this.loadMembers();
    }
  }

  resetFilters() {
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }

  changePage($event: PageEvent) {
    if (this.userParams) {
      this.userParams.pageNumber = $event.pageIndex + 1;
      this.userParams.pageSize = $event.pageSize;
      this.memberService.setUserParams(this.userParams);
      this.loadMembers();
    }
  }
}
