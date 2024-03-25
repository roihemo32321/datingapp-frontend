import { Component, Input, OnInit } from '@angular/core';
import { Member } from '../../../models/member';
import { MembersService } from '../../../services/members.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss',
})
export class MemberCardComponent implements OnInit {
  @Input() member: Member | undefined;

  constructor(private memberService: MembersService) {}

  ngOnInit(): void {
    console.log(this.member);
  }
  addLike(member: Member, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.memberService.addLike(member.username).subscribe({
      next: () => {
        console.log(`You liked ${member.knownAs}`);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
