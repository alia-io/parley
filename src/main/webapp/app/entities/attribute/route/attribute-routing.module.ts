import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AttributeComponent } from '../list/attribute.component';
import { AttributeDetailComponent } from '../detail/attribute-detail.component';
import { AttributeUpdateComponent } from '../update/attribute-update.component';
import { AttributeRoutingResolveService } from './attribute-routing-resolve.service';

const attributeRoute: Routes = [
  {
    path: '',
    component: AttributeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AttributeDetailComponent,
    resolve: {
      attribute: AttributeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AttributeUpdateComponent,
    resolve: {
      attribute: AttributeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AttributeUpdateComponent,
    resolve: {
      attribute: AttributeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(attributeRoute)],
  exports: [RouterModule],
})
export class AttributeRoutingModule {}
