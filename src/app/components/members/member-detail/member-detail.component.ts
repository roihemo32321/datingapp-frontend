import { Component, OnInit } from '@angular/core';
import { Member } from '../../../models/member';
import { MembersService } from '../../../services/members.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss',
})
export class MemberDetailComponent implements OnInit {
  member: Member | undefined;

  constructor(
    private memberService: MembersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) return;
    this.memberService.getMember(username).subscribe({
      next: (member) => {
        this.member = member;
      },
    });
  }
}
