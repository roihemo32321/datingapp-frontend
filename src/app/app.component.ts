import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'dating-frontend';
  users: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('https://localhost:5003/api/users').subscribe({
      next: (response) => (this.users = response),
      error: (err) => console.log(err),
      complete: () => console.log('Request Completed'),
    });
  }
}
