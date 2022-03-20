import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUsers } from '../users.model';
import { UsersService } from '../service/users.service';
import { UsersDeleteDialogComponent } from '../delete/users-delete-dialog.component';
import { UserDisplayDTO } from '../../user/user.model';
import { take } from 'rxjs';

@Component({
  selector: 'jhi-users',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  users?: UserDisplayDTO[];
  isLoading = false;

  constructor(protected usersService: UsersService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;
    this.usersService
      .getUserDisplayList()
      .pipe(take(1))
      .subscribe(userList => {
        this.users = userList;
        this.isLoading = false;
      });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IUsers): number {
    return item.id!;
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
