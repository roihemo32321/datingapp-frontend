import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../../models/member';
import { User } from '../../../models/user';
import { MembersService } from '../../../services/members.service';
import { AccountService } from '../../../services/account.service';
import { take } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.scss',
})
export class MemberEditComponent implements OnInit {
  // HostListener can be used to make events when something changed in browser, here we guard the app router when our form changed.
  @HostListener('window:beforeunload', ['$event']) unloadNotification(
    $event: any
  ) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }

  @ViewChild('editForm') editForm: NgForm | undefined;
  member: Member | undefined;
  user: User | null = null;

  constructor(
    private accountService: AccountService,
    private memberService: MembersService
  ) {
    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe({ next: (user) => (this.user = user) });
  }

  ngOnInit(): void {
    console.log(this.user?.username);

    this.loadMember();
  }

  loadMember() {
    if (!this.user) return;
    this.memberService
      .getMember(this.user.username)
      .subscribe({ next: (member) => (this.member = member) });
  }

  updateMember() {
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: () => this.editForm?.reset(this.member),
    });
  }
}
