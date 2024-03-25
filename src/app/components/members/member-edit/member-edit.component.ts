import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../../models/member';
import { User } from '../../../models/user';
import { MembersService } from '../../../services/members.service';
import { AccountService } from '../../../services/account.service';
import { switchMap, take } from 'rxjs';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { FileUploadService } from '../../../services/file-upload.service';

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
  editForm: FormGroup | undefined;

  formSections: { label: string; controlName: string; type: string }[] = [
    { label: 'Introduction', controlName: 'introduction', type: 'textarea' },
    { label: 'Looking For', controlName: 'lookingFor', type: 'textarea' },
    { label: 'Interests', controlName: 'interests', type: 'textarea' },
    { label: 'City', controlName: 'city', type: 'text' },
    { label: 'Country', controlName: 'country', type: 'text' },
  ];

  member: Member | undefined;
  user: User | null = null;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private memberService: MembersService
  ) {
    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe({ next: (user) => (this.user = user) });
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    if (!this.user) return;
    this.memberService.getMember(this.user.username).subscribe({
      next: (member) => {
        this.member = member;
        this.editForm = this.fb.group({
          introduction: [member.introduction],
          lookingFor: [member.lookingFor],
          interests: [member.interests],
          city: [member.city],
          country: [member.country],
        });
      },
    });
  }

  updateMember() {
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: () => this.loadMember(),
    });
  }
}
