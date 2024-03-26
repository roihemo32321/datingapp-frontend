import { Component, OnInit } from '@angular/core';
import { Message } from '../../models/message';
import { Pagination } from '../../models/pagination';
import { MessageService } from '../../services/message.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent implements OnInit {
  messages?: Message[];
  pagination?: Pagination;
  viewOptions = ['Unread', 'Inbox', 'Outbox'];
  container = 'Inbox';
  pageNumber = 1;
  pageSize = 5;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.messageService
      .getMessages(this.pageNumber, this.pageSize, this.container)
      .subscribe((res) => {
        if (res) {
          this.messages = res.result;
          this.pagination = res.pagination;
        }
      });
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe(() =>
      this.messages?.splice(
        this.messages.findIndex((m) => m.id === id),
        1
      )
    );
  }

  changePage($event: PageEvent) {
    this.pageNumber = $event.pageIndex + 1;
    this.pageSize = $event.pageSize;
    this.loadMessages();
  }
}
