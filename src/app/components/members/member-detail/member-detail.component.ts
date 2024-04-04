import { Component, OnDestroy, OnInit } from '@angular/core';
import { Member } from '../../../models/member';
import { MembersService } from '../../../services/members.service';
import { ActivatedRoute } from '@angular/router';
import { PresenceService } from '../../../services/presence.service';
import { MessageService } from '../../../services/message.service';
import { AccountService } from '../../../services/account.service';
import { User } from '../../../models/user';
import { take } from 'rxjs';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss',
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  member: Member | undefined;
  user?: User;
  currentView: string = 'more';
  detailsMap: { label: string; value: keyof Member }[] = [
    { label: 'Known As:', value: 'knownAs' },
    { label: 'Age:', value: 'age' },
    { label: 'Gender:', value: 'gender' },
    { label: 'Country:', value: 'country' },
    { label: 'City:', value: 'city' },
    { label: 'Last Active:', value: 'lastActive' },
    { label: 'Member Since:', value: 'created' },
  ];

  mainDetailsMap: { label: string; value: keyof Member }[] = [
    { label: 'Introduction:', value: 'introduction' },
    { label: 'Looking For:', value: 'lookingFor' },
    { label: 'Interests:', value: 'interests' },
  ];

  constructor(
    private memberService: MembersService,
    private route: ActivatedRoute,
    public presenceService: PresenceService,
    private messageService: MessageService,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) this.user = user;
      },
    });
  }

  ngOnInit(): void {
    this.loadMember();
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
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

  onTabClick(tab: string) {
    this.currentView = tab;

    if (this.currentView === 'messages' && this.user && this.member?.username) {
      this.messageService.createHubConnection(this.user, this.member.username);
    } else {
      this.messageService.stopHubConnection();
    }
  }
}
