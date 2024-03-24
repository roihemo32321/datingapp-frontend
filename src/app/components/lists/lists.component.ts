import { Component, OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { MembersService } from "../../services/members.service";
import { Pagination } from "../../models/pagination";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.scss',
})
export class ListsComponent implements OnInit {
  members: Member[] | undefined;
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;
  pagination: Pagination | undefined;

  constructor(private memberService: MembersService) {
  }
  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next: (res) => {
        this.members = res?.result;
        this.pagination = res?.pagination;
      },
    });
  }

  changePage($event: PageEvent) {
    if (this.pageNumber!== $event.pageIndex + 1) {
      this.pageNumber = $event.pageIndex + 1;
      this.pageSize = $event.pageSize;
      this.loadLikes();
    }
  }
}
