import { Component, OnInit } from '@angular/core';
import { Member } from '../../../models/member';
import { MembersService } from '../../../services/members.service';
import { Pagination } from '../../../models/pagination';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss',
})
export class MemberListComponent implements OnInit {
  members: Member[] | undefined;
  pagination: Pagination | undefined;
  pageNumber = 1;
  pageSize = 4;

  constructor(private memberService: MembersService) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    // Load members for current page
    this.memberService.getMembers(this.pageNumber, this.pageSize).subscribe({
      next: (res) => {
        this.members = res?.result;
        this.pagination = res?.pagination;
      },
    });
  }

  changePage($event: PageEvent) {
    this.pageNumber = $event.pageIndex + 1;
    this.pageSize = $event.pageSize;
    this.loadMembers();
  }
}
