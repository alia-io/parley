import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UsersComponent } from '../list/users.component';
import { UsersDetailComponent } from '../detail/users-detail.component';
import { UsersUpdateComponent } from '../update/users-update.component';
import { UsersRoutingResolveService } from './users-routing-resolve.service';

const usersRoute: Routes = [
  {
    path: '',
    component: UsersComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UsersDetailComponent,
    resolve: {
      users: UsersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UsersUpdateComponent,
    resolve: {
      users: UsersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UsersUpdateComponent,
    resolve: {
      users: UsersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(usersRoute)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
