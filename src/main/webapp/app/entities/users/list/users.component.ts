import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UsersDisplayDTO } from '../users.model';
import { UsersService } from '../service/users.service';
import { UsersDeleteDialogComponent } from '../delete/users-delete-dialog.component';
import { take } from 'rxjs';

@Component({
  selector: 'jhi-users',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  users?: UsersDisplayDTO[];
  isLoading = false;
  noUsersHaveInterviews = true;

  constructor(protected usersService: UsersService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;
    this.usersService
      .getUserDisplayList()
      .pipe(take(1))
      .subscribe(userList => {
        this.users = userList;
        for (const user of userList) {
          if (user.interviewIds!.length > 0) {
            this.noUsersHaveInterviews = false;
            break;
          }
        }
        this.isLoading = false;
      });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: UsersDisplayDTO): number {
    return item.id;
  }

  delete(id: number): void {
    const modalRef = this.modalService.open(UsersDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.usersId = id;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
