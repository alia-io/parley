import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AttributeComponent } from './list/attribute.component';
import { AttributeDetailComponent } from './detail/attribute-detail.component';
import { AttributeUpdateComponent } from './update/attribute-update.component';
import { AttributeDeleteDialogComponent } from './delete/attribute-delete-dialog.component';
import { AttributeRoutingModule } from './route/attribute-routing.module';

@NgModule({
  imports: [SharedModule, AttributeRoutingModule],
  declarations: [AttributeComponent, AttributeDetailComponent, AttributeUpdateComponent, AttributeDeleteDialogComponent],
  entryComponents: [AttributeDeleteDialogComponent],
})
export class AttributeModule {}
