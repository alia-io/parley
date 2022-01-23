import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { InterviewComponent } from '../list/interview.component';
import { InterviewDetailComponent } from '../detail/interview-detail.component';
import { InterviewUpdateComponent } from '../update/interview-update.component';
import { InterviewRoutingResolveService } from './interview-routing-resolve.service';

const interviewRoute: Routes = [
  {
    path: '',
    component: InterviewComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InterviewDetailComponent,
    resolve: {
      interview: InterviewRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InterviewUpdateComponent,
    resolve: {
      interview: InterviewRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InterviewUpdateComponent,
    resolve: {
      interview: InterviewRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(interviewRoute)],
  exports: [RouterModule],
})
export class InterviewRoutingModule {}
