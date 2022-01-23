import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUsers } from '../users.model';

@Component({
  selector: 'jhi-users-detail',
  templateUrl: './users-detail.component.html',
})
export class UsersDetailComponent implements OnInit {
  users: IUsers | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ users }) => {
      this.users = users;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
