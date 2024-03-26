import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Member } from '../../../../models/member';
import { MembersService } from '../../../../services/members.service';
import { User } from '../../../../models/user';

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.component.html',
  styleUrl: './edit-info.component.scss',
})
export class EditInfoComponent implements OnInit {
  @HostListener('window:beforeunload', ['$event']) unloadNotification(
    $event: any
  ) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  @Input() member: Member | undefined;
  @Input() user: User | undefined;
  editForm: FormGroup = new FormGroup({});
  formSections: { label: string; controlName: string; type: string }[] = [
    { label: 'Introduction', controlName: 'introduction', type: 'textarea' },
    { label: 'Looking For', controlName: 'lookingFor', type: 'textarea' },
    { label: 'Interests', controlName: 'interests', type: 'textarea' },
    { label: 'City', controlName: 'city', type: 'text' },
    { label: 'Country', controlName: 'country', type: 'text' },
  ];

  ngOnInit(): void {
    this.loadForm();
  }

  constructor(private memberService: MembersService, private fb: FormBuilder) {}

  loadForm() {
    if (this.member) {
      this.editForm = this.fb.group({
        introduction: [this.member.introduction],
        lookingFor: [this.member.lookingFor],
        interests: [this.member.interests],
        city: [this.member.city],
        country: [this.member.country],
      });
    }
  }

  updateMember() {
    if (this.user) {
      this.memberService
        .updateMember(this.editForm?.value, this.user.username)
        .subscribe({
          next: () => {
            if (this.member) {
              this.member = { ...this.member, ...this.editForm.value };
            }

            this.editForm.reset(this.member);
          },
        });
    }
  }
}
