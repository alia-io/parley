import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UsersService } from '../service/users.service';

@Component({
  templateUrl: './users-delete-dialog.component.html',
})
export class UsersDeleteDialogComponent {
  usersId?: number;

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
