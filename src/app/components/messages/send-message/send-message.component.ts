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
  messages: Message[] = [];
  newMessage: string = '';

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    if (!this.username) return;

    this.messageService.getMessageThread(this.username).subscribe({
      next: (messages) => {
        this.messages = messages;
      },
    });
  }

  sendMessage() {
    if (!this.username) return;
    this.messageService.sendMessage(this.username, this.newMessage).subscribe({
      next: (message) => {
        this.newMessage = '';
        this.messages.push(message);
      },
    });
  }
}
