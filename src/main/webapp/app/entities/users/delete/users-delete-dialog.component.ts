import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUsers } from '../users.model';
import { UsersService } from '../service/users.service';

@Component({
  templateUrl: './users-delete-dialog.component.html',
})
export class UsersDeleteDialogComponent {
  users?: IUsers;

  constructor(protected usersService: UsersService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.usersService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
