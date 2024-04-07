import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Message } from '../../../models/message';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrl: './send-message.component.scss',
})
export class SendMessageComponent implements AfterViewChecked {
  @Input() username?: string;
  @ViewChild('scrollMe') private myScrollContainer?: ElementRef;
  newMessage: string = '';

  constructor(public messageService: MessageService) {}

  ngAfterViewChecked() {
    // Scroll to the bottom of the chat window
    if (this.myScrollContainer) {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    }
  }

  sendMessage() {
    if (!this.username) return;
    this.messageService.sendMessage(this.username, this.newMessage).then(() => {
      this.newMessage = '';
    });
  }
}
