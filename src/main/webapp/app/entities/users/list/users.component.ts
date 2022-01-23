import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUsers } from '../users.model';
import { UsersService } from '../service/users.service';
import { UsersDeleteDialogComponent } from '../delete/users-delete-dialog.component';

@Component({
  selector: 'jhi-users',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  users?: IUsers[];
  isLoading = false;

  constructor(protected usersService: UsersService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.usersService.query().subscribe({
      next: (res: HttpResponse<IUsers[]>) => {
        this.isLoading = false;
        this.users = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IUsers): number {
    return item.id!;
  }

  delete(users: IUsers): void {
    const modalRef = this.modalService.open(UsersDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.users = users;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
