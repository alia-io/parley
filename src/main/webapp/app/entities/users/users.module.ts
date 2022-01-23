import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UsersComponent } from './list/users.component';
import { UsersDetailComponent } from './detail/users-detail.component';
import { UsersUpdateComponent } from './update/users-update.component';
import { UsersDeleteDialogComponent } from './delete/users-delete-dialog.component';
import { UsersRoutingModule } from './route/users-routing.module';

@NgModule({
  imports: [SharedModule, UsersRoutingModule],
  declarations: [UsersComponent, UsersDetailComponent, UsersUpdateComponent, UsersDeleteDialogComponent],
  entryComponents: [UsersDeleteDialogComponent],
})
export class UsersModule {}
