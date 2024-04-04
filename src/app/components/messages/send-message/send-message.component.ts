import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../../../models/message';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrl: './send-message.component.scss',
})
export class SendMessageComponent implements OnInit {
  @Input() username?: string;
  newMessage: string = '';

  constructor(public messageService: MessageService) {}

  ngOnInit(): void {}

  sendMessage() {
    if (!this.username) return;
    this.messageService.sendMessage(this.username, this.newMessage).then(() => {
      this.newMessage = '';
    });
  }
}
